"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Share2, RotateCcw, Home } from "lucide-react";
import { num } from "../lib/translations";
import sound from "../lib/soundManager";
export default function GameResult({ cfg, res, t, lang, onAgain, onHome }) {
  const r = useRef(),
    [cp, setCp] = useState(false),
    n = (v) => num(v, lang);
  const [a, b] = res.scores,
    [p1, p2] = cfg.names,
    w = a > b ? 0 : b > a ? 1 : -1;
  const title =
    w < 0
      ? t.draw
      : cfg.mode === "cpu"
        ? w === 0
          ? t.youWin
          : t.cpuWin
        : t.win(cfg.names[w]);
  const margin =
    w < 0
      ? t.drawM
      : w === 0
        ? t.byRuns(n(a - b))
        : t.byBalls(n(res.max - res.balls[1]));
  const line = w < 0 ? t.drawM : t.won(cfg.names[w]);
  useEffect(() => {
    if (w >= 0) sound.play("win");
    const c = gsap.context(() => {
      gsap.from(".trophy", {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: "elastic.out(1,.5)",
      });
      gsap.from(".rcard", { y: 40, opacity: 0, duration: 0.6 });
      if (w >= 0) {
        const f = r.current;
        for (let i = 0; i < 40; i++) {
          const d = document.createElement("i");
          d.className = "conf";
          d.style.background = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"][
            i % 4
          ];
          d.style.left = Math.random() * 100 + "%";
          f.appendChild(d);
          gsap.fromTo(
            d,
            { y: -20, rotation: 0 },
            {
              y: f.offsetHeight,
              x: (Math.random() - 0.5) * 120,
              rotation: Math.random() * 720,
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.8,
              ease: "power1.in",
              onComplete: () => d.remove(),
            },
          );
        }
      }
    }, r);
    return () => c.revert();
  }, []);
  const text = `KHAATA CRICKET\n${t.winner}: ${w < 0 ? "—" : cfg.names[w]}\n${p1}: ${a} ${t.runs}\n${p2}: ${b} ${t.runs}\n${line}`;
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Khaata Cricket", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCp(true);
        setTimeout(() => setCp(false), 1800);
      }
    } catch (e) {}
  };
  return (
    <section ref={r} className="screen result">
      <div className="trophy">{w < 0 ? "🤝" : "🏆"}</div>
      <h2>{title}</h2>
      <div className="rcard">
        <h3 className="logo sm">KHAATA CRICKET</h3>
        <p>
          {t.winner}: <b>{w < 0 ? "—" : cfg.names[w]}</b>
        </p>
        <p>
          {p1}: <b>{n(a)}</b> {t.runs}
        </p>
        <p>
          {p2}: <b>{n(b)}</b> {t.runs}
        </p>
        <p>
          {t.overs}: {n(cfg.overs)}
        </p>
        <p>
          {t.margin}: {margin}
        </p>
        <p className="big">{line}</p>
      </div>
      <button className="btn" onClick={share}>
        <Share2 size={18} /> {cp ? t.shared : t.share}
      </button>
      <button className="btn big" onClick={onAgain}>
        <RotateCcw size={18} /> {t.again}
      </button>
      <button className="btn ghost" onClick={onHome}>
        <Home size={18} /> {t.home}
      </button>
    </section>
  );
}
