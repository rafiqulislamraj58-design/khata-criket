'use client';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import gsap from 'gsap';
import { SEGS, COLORS } from '../lib/gameEngine';
import sm from '../lib/soundManager';

const SEG_ANGLE = 360 / SEGS.length; // 45deg for 8 segments
const SPIN_SECONDS = 5;
const FULL_TURNS = 8; // more turns so 5s still feels fast at the start
const MIN_TAP_DELAY_MS = 250; // ignore accidental taps right after spin starts

const bg = `conic-gradient(from -${SEG_ANGLE / 2}deg, ${COLORS.map(
  (c, i) => `${c} ${i * SEG_ANGLE}deg ${(i + 1) * SEG_ANGLE}deg`
).join(',')})`;

const mod360 = (n) => ((n % 360) + 360) % 360;

const SpinnerWheel = forwardRef(function SpinnerWheel(_, ref) {
  const el = useRef(null);
  const rotation = useRef(0); // last known resting/target rotation
  const target = useRef(0);
  const tween = useRef(null);
  const resolveRef = useRef(null);
  const spinningRef = useRef(false);
  const startedAt = useRef(0);
  const lastTick = useRef(0);
  const lastShown = useRef(-1);

  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const finishSpin = useCallback(() => {
    if (!spinningRef.current) return;
    spinningRef.current = false;
    tween.current = null;
    lastShown.current = -1;

    setIsSpinning(false);
    setTimeLeft(0);

    sm.stopSpin?.();
    sm.startBgm?.();

    resolveRef.current?.();
    resolveRef.current = null;
  }, []);

  // Tick sound + countdown + progress bar driven by the animation itself
  const onUpdate = useCallback(
    (progress) => {
      const rot = Number(gsap.getProperty(el.current, 'rotation')) || 0;
      const seg = Math.floor((rot + SEG_ANGLE / 2) / SEG_ANGLE);
      if (seg !== lastTick.current) {
        lastTick.current = seg;
        sm.play?.('tick');
      }

      const shown = Math.round(SPIN_SECONDS * (1 - progress) * 10) / 10;
      if (shown !== lastShown.current) {
        lastShown.current = shown;
        setTimeLeft(shown);
      }
    },
    []
  );

  const stopNow = useCallback(() => {
    if (!spinningRef.current || !tween.current) return;
    if (Date.now() - startedAt.current < MIN_TAP_DELAY_MS) return;

    tween.current.kill();

    const current = Number(gsap.getProperty(el.current, 'rotation')) || 0;
    // shortest forward distance to the already-decided target angle
    const diff = mod360(target.current - current);
    const stopTo = current + diff;
    rotation.current = stopTo;
    target.current = stopTo;

    tween.current = gsap.to(el.current, {
      rotation: stopTo,
      duration: 0.3 + (diff / 360) * 0.5,
      ease: 'power2.out',
      onUpdate: () => setTimeLeft(0),
      onComplete: finishSpin,
    });
  }, [finishSpin]);

  useImperativeHandle(
    ref,
    () => ({
      spin: (idx) =>
        new Promise((res) => {
          // never run two spins at once: settle the previous promise first
          if (spinningRef.current) {
            tween.current?.kill();
            finishSpin();
          }

          resolveRef.current = res;
          spinningRef.current = true;
          startedAt.current = Date.now();
          lastTick.current = Math.floor((rotation.current + SEG_ANGLE / 2) / SEG_ANGLE);
          setIsSpinning(true);
          setTimeLeft(SPIN_SECONDS);

          sm.stopBgm?.();
          sm.play?.('spin');

          // jitter keeps the pointer inside the segment, never on a divider
          const jitter = (Math.random() - 0.5) * SEG_ANGLE * 0.6;
          const base = mod360(-idx * SEG_ANGLE - rotation.current);
          const to = rotation.current + 360 * FULL_TURNS + base + jitter;
          rotation.current = to;
          target.current = to;

          if (reduceMotion) {
            gsap.set(el.current, { rotation: to });
            setTimeout(finishSpin, 400);
            return;
          }

          tween.current = gsap.to(el.current, {
            rotation: to,
            duration: SPIN_SECONDS,
            ease: 'power4.out',
            onUpdate: function () {
              onUpdate(this.progress());
            },
            onComplete: finishSpin,
          });
        }),
    }),
    [finishSpin, onUpdate, reduceMotion]
  );

  // Cleanup: kill animation, stop sound, and never leave a promise hanging
  useEffect(() => {
    const node = el.current;
    return () => {
      gsap.killTweensOf(node);
      if (spinningRef.current) {
        spinningRef.current = false;
        sm.stopSpin?.();
        resolveRef.current?.();
        resolveRef.current = null;
      }
    };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      stopNow();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        className="wheelWrap"
        role="button"
        tabIndex={isSpinning ? 0 : -1}
        aria-label={isSpinning ? 'Stop the wheel' : 'Spinner wheel'}
        aria-disabled={!isSpinning}
        onClick={stopNow}
        onKeyDown={onKeyDown}
        style={{ cursor: isSpinning ? 'pointer' : 'default', touchAction: 'manipulation' }}
      >
        <div className="pointer" aria-hidden="true">
          <div className="pointerPin" />
        </div>

        <div className="wheelRim">
          <div className="wheel" ref={el} style={{ background: bg, willChange: 'transform' }}>
            <div className="wheelGloss" />

            {SEGS.map((s, i) => (
              <div key={`${s}-${i}`}>
                <div
                  className="divider"
                  style={{ transform: `rotate(${i * SEG_ANGLE - SEG_ANGLE / 2}deg)` }}
                >
                  <span className="peg" />
                </div>

                <div className="lbl" style={{ transform: `rotate(${i * SEG_ANGLE}deg)` }}>
                  <span className={s === 'OUT' ? 'out' : s === '6' || s === '4' ? 'boundary' : ''}>
                    {s}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hub">
            <span>🏏</span>
          </div>
        </div>
      </div>

      <div style={{ minHeight: 34, display: 'flex', alignItems: 'center' }} aria-live="polite">
        {isSpinning && (
          <div className="countdownBadge">
            ⏱️ <strong>{timeLeft.toFixed(1)}s</strong> — Tap wheel to stop!
          </div>
        )}
      </div>
    </div>
  );
});

export default SpinnerWheel;