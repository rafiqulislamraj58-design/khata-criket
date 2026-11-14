"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Home } from "lucide-react";
import SpinnerWheel from "./SpinnerWheel";
import ScoreBoard from "./ScoreBoard";
import BallHistory from "./BallHistory";
import { pickIndex, applyBall, init } from "../lib/gameEngine";
import sound from "../lib/soundManager";
const KEY = [null, null, null, "three", "four", null, "six", "out"];
const SND = { four: "four", six: "six", out: "out" };
export default function GameScreen({ cfg, t, lang, onFinish, onHome }) {
  const max = cfg.overs * 6,
    names = cfg.names;
  const [st, setSt] = useState(init),
    [msg, setMsg] = useState(null),
    [busy, setBusy] = useState(false);
  const wheel = useRef(),
    lock = useRef(false),
    R = useRef(st),
    mref = useRef(),
    alive = useRef(true);
  R.current = st;
  const isCpu = cfg.mode === "cpu" && st.inn === 1;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const spin = useCallback(async () => {
    const s = R.current;
    if (lock.current || s.brk || s.done) return;
    lock.current = true;
    setBusy(true);
    setMsg(null);
    const idx = pickIndex();
    sound.play("spin");
    await wheel.current.spin(idx);
    if (!alive.current) return;
    setSt((p) => applyBall(p, idx, max));
    const k = KEY[idx];
    if (k) {
      setMsg({ k, cpu: cfg.mode === "cpu" && s.inn === 1, id: Date.now() });
      SND[k] && sound.play(SND[k]);
    }
    lock.current = false;
    setBusy(false);
  }, [max, cfg.mode]);
  useEffect(() => {
    if (!msg) return;
    const tl = gsap.timeline();
    tl.fromTo(
      mref.current,
      { scale: 0.4, opacity: 0, rotation: -8 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(3)" },
    ).to(mref.current, { opacity: 0, delay: 1.1, duration: 0.4 });
    return () => tl.kill();
  }, [msg]);
  useEffect(() => {
    if (isCpu && !st.brk && !st.done && !busy) {
      const id = setTimeout(spin, 1400);
      return () => clearTimeout(id);
    }
  }, [isCpu, st.brk, st.done, busy, st.balls, spin]);
  useEffect(() => {
    if (st.done) {
      const id = setTimeout(
        () => onFinish({ scores: st.scores, balls: st.balls, max }),
        1800,
      );
      return () => clearTimeout(id);
    }
  }, [st.done]);
  const status = isCpu
    ? busy
      ? t.cpuGo
      : t.thinking
    : cfg.mode === "cpu"
      ? t.youBat
      : t.bat(names[st.inn]);
  const rk =
    msg && (msg.cpu ? "cpu" + msg.k[0].toUpperCase() + msg.k.slice(1) : msg.k);
  return (
    <section className="screen game">
      <button className="back" onClick={onHome}>
        <Home size={18} /> {t.home}
      </button>
      <ScoreBoard st={st} max={max} t={t} lang={lang} names={names} />
      <p className="status">{status}</p>
      <div className="wheelArea">
        <SpinnerWheel ref={wheel} />
        <div ref={mref} className={"react " + (msg ? msg.k : "")}>
          {msg && t.r[rk]}
        </div>
      </div>
      <BallHistory list={st.hist[st.inn]} />
      <button
        className="btn big spin"
        disabled={busy || isCpu || st.brk || st.done}
        onClick={spin}
      >
        {t.spin}
      </button>
      {st.brk && (
        <div className="modal">
          <div className="card">
            <h2>{t.brk}</h2>
            <p>{t.brkTxt(names[0], st.scores[0], st.scores[0] + 1)}</p>
            <button
              className="btn"
              onClick={() => setSt((p) => ({ ...p, inn: 1, brk: false }))}
            >
              {t.cont}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
