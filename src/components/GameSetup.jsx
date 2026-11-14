"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { num } from "../lib/translations";
export default function GameSetup({ t, lang, onStart, onBack }) {
  const [mode, setMode] = useState("cpu"),
    [overs, setOvers] = useState(2),
    [n1, setN1] = useState(""),
    [n2, setN2] = useState("");
  const go = () =>
    onStart({
      mode,
      overs,
      names: [
        n1.trim() || (mode === "cpu" ? t.you : t.p1),
        mode === "cpu" ? t.computer : n2.trim() || t.p2,
      ],
    });
  return (
    <section className="screen setup">
      <button className="back" onClick={onBack}>
        <ArrowLeft size={18} /> {t.home}
      </button>
      <h2>{t.mode}</h2>
      <div className="row">
        {[
          ["cpu", t.pvc],
          ["pvp", t.pvp],
        ].map(([k, l]) => (
          <button
            key={k}
            className={"chip " + (mode === k ? "on" : "")}
            onClick={() => setMode(k)}
          >
            {l}
          </button>
        ))}
      </div>
      <h2>{t.pname}</h2>
      <input
        maxLength={14}
        placeholder={mode === "cpu" ? t.you : t.p1}
        value={n1}
        onChange={(e) => setN1(e.target.value)}
      />
      {mode === "pvp" ? (
        <input
          maxLength={14}
          placeholder={t.p2}
          value={n2}
          onChange={(e) => setN2(e.target.value)}
        />
      ) : (
        <input disabled value={t.computer} readOnly />
      )}
      <h2>{t.selOvers}</h2>
      <div className="row">
        {[1, 2, 3, 5, 10].map((o) => (
          <button
            key={o}
            className={"chip " + (overs === o ? "on" : "")}
            onClick={() => setOvers(o)}
          >
            {num(o, lang)}
          </button>
        ))}
      </div>
      <p className="note">
        {t.overs}: {num(overs, lang)} ({num(overs * 6, lang)})
      </p>
      <button className="btn big" onClick={go}>
        {t.start}
      </button>
    </section>
  );
}
