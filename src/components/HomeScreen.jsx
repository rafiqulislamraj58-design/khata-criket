'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, BookOpen, Users, CalendarClock } from 'lucide-react';

const STYLES = `
/* Primary button: soft shine sweep */
.hm-shine { position: relative; overflow: hidden; }
.hm-shine::after {
  content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent);
  transform: skewX(-20deg); animation: hm-sweep 3.2s ease-in-out infinite; pointer-events: none;
}
@keyframes hm-sweep { 0%, 55% { left: -60%; } 100% { left: 130%; } }

/* Visitor stats */
.hm-stats { display: flex; gap: 12px; justify-content: center; margin-top: 22px; width: 100%; }
.hm-stat {
  flex: 0 1 140px; padding: 12px 14px; border-radius: 16px; text-align: center;
  background: linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.06));
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: 0 8px 22px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.18);
  backdrop-filter: blur(8px);
}
.hm-num { display: block; font-size: 28px; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums; min-height: 31px; }
.hm-label { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 4px; font-size: 12px; opacity: .85; }
.hm-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 0 rgba(34,197,94,.7); animation: hm-live 1.6s infinite; }
@keyframes hm-live { 70% { box-shadow: 0 0 0 7px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }

/* Loading skeleton so layout doesn't jump */
.hm-skel { display: inline-block; width: 56px; height: 24px; border-radius: 8px; vertical-align: middle;
  background: linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.28), rgba(255,255,255,.1));
  background-size: 200% 100%; animation: hm-shimmer 1.2s linear infinite; }
@keyframes hm-shimmer { to { background-position: -200% 0; } }

@media (max-width: 380px) { .hm-stat { padding: 10px 8px; } .hm-num { font-size: 24px; } }
@media (prefers-reduced-motion: reduce) { .hm-shine::after, .hm-dot, .hm-skel { animation: none; } }
`;

function getVisitorId() {
  try {
    let id = localStorage.getItem('kc_vid');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('kc_vid', id);
    }
    return id;
  } catch {
    return null; // private mode: still show counts, just don't register this visit
  }
}

export default function HomeScreen({ t, onNew, onHelp }) {
  const containerRef = useRef(null);
  const todayRef = useRef(null);
  const yestRef = useRef(null);
  const [stats, setStats] = useState(null); // null = loading
  const [failed, setFailed] = useState(false);

  // Entrance + floating doodles
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stag',
        { y: reduce ? 0 : 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: reduce ? 0.2 : 0.6,
          ease: 'back.out(1.7)',
          clearProps: 'transform,opacity',
        }
      );

      if (!reduce) {
        gsap.to('.doodle', {
          y: -10,
          rotation: '+=8',
          repeat: -1,
          yoyo: true,
          stagger: 0.25,
          duration: 1.4,
          ease: 'sine.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Register this visit once and load today/yesterday counts
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid: getVisitorId() }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStats({ today: d.today ?? 0, yesterday: d.yesterday ?? 0 }))
      .catch((e) => {
        if (e?.name !== 'AbortError') setFailed(true); // stats are optional
      });
    return () => ctrl.abort();
  }, []);

  // Count-up animation once data arrives
  useEffect(() => {
    if (!stats) return;
    const o = { a: 0, b: 0 };
    const tw = gsap.to(o, {
      a: stats.today,
      b: stats.yesterday,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        if (todayRef.current) todayRef.current.textContent = Math.round(o.a).toLocaleString();
        if (yestRef.current) yestRef.current.textContent = Math.round(o.b).toLocaleString();
      },
    });
    return () => tw.kill();
  }, [stats]);

  return (
    <section ref={containerRef} className="screen home">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <span className="doodle d1" aria-hidden="true">🏏</span>
      <span className="doodle d2" aria-hidden="true">⚾</span>
      <span className="doodle d3" aria-hidden="true">🏆</span>

      <h1 className="logo stag">
        KHAATA<br />CRICKET
      </h1>
      <p className="tag stag">{t?.tag}</p>

      <button type="button" className="btn big hm-shine stag" onClick={onNew}>
        <Play size={20} /> {t?.newGame}
      </button>

      <button type="button" className="btn ghost stag" onClick={onHelp}>
        <BookOpen size={18} /> {t?.how}
      </button>

      {!failed && (
        <div className="hm-stats stag" role="group" aria-label={t?.visitors ?? 'Visitors'} aria-busy={!stats}>
          <div className="hm-stat">
            <b className="hm-num" ref={todayRef}>
              {!stats && <span className="hm-skel" />}
            </b>
            <span className="hm-label">
              <i className="hm-dot" aria-hidden="true" />
              <Users size={12} aria-hidden="true" /> {t?.today ?? 'Today'}
            </span>
          </div>

          <div className="hm-stat">
            <b className="hm-num" ref={yestRef}>
              {!stats && <span className="hm-skel" />}
            </b>
            <span className="hm-label">
              <CalendarClock size={12} aria-hidden="true" /> {t?.yesterday ?? 'Yesterday'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}