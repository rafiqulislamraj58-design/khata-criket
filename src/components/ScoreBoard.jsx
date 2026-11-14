"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { oversStr } from "../lib/gameEngine";
import { num } from "../lib/translations";
export default function ScoreBoard({ st, max, t, lang, names }) {
  const i = st.inn,
    s = st.scores[i],
    b = st.balls[i],
    wk = st.hist[i].includes("OUT") ? 1 : 0,
    ref = useRef(),
    n = (v) => num(v, lang);
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { scale: 1.5, color: "#d62828" },
      { scale: 1, color: "#1d3557", duration: 0.5, ease: "back.out(2)" },
    );
  }, [s]);
  const rr = b ? ((s * 6) / b).toFixed(2) : "0.00",
    tg = st.scores[0] + 1;
  return (
    <div className="board">
      <div className="who">
        {i ? t.inn2 : t.inn1} · {names[i]}
      </div>
      <div className="big">
        {t.score}:{" "}
        <b ref={ref}>
          {n(s)}/{n(wk)}
        </b>
      </div>
      <div className="grid">
        <span>
          {t.ovr}: {n(oversStr(b))}
        </span>
        <span>
          {t.rr}: {n(rr)}
        </span>
        {i === 1 && (
          <>
            <span>
              {t.target}: {n(tg)}
            </span>
            <span>
              {t.need}: {n(Math.max(0, tg - s))} {t.runs}
            </span>
            <span>
              {t.left}: {n(max - b)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
