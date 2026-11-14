"use client";
import { Volume2, VolumeX } from "lucide-react";
export default function Controls({ lang, onLang, snd, onSnd }) {
  return (
    <div className="controls">
      <div className="pill">
        {[
          ["bn", "বাংলা"],
          ["en", "English"],
        ].map(([k, l]) => (
          <button
            key={k}
            className={lang === k ? "on" : ""}
            onClick={() => onLang(k)}
          >
            {l}
          </button>
        ))}
      </div>
      <button className="icon" onClick={onSnd} aria-label="sound">
        {snd ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}
