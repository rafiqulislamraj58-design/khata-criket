"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HomeScreen from "../components/HomeScreen";
import GameSetup from "../components/GameSetup";
import GameScreen from "../components/GameScreen";
import Controls from "../components/Controls";
import { T } from "../lib/translations";
import sound from "../lib/soundManager";
const GameResult = dynamic(() => import("../components/GameResult"));
export default function Page() {
  const [screen, setScreen] = useState("home"),
    [lang, setLang] = useState("bn"),
    [snd, setSnd] = useState(false);
  const [cfg, setCfg] = useState(null),
    [res, setRes] = useState(null),
    [help, setHelp] = useState(false);
  useEffect(() => {
    const l = localStorage.getItem("kc_lang");
    if (l === "bn" || l === "en") setLang(l);
    const s = localStorage.getItem("kc_snd") === "1";
    setSnd(s);
    sound.setOn(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const chLang = (l) => {
    setLang(l);
    localStorage.setItem("kc_lang", l);
  };
  const chSnd = () => {
    const v = !snd;
    setSnd(v);
    sound.setOn(v);
    localStorage.setItem("kc_snd", v ? "1" : "0");
  };
  const t = T[lang];
  const home = () => {
    setScreen("home");
    setRes(null);
  };
  return (
    <main className="book">
      <div className="paper">
        <Controls lang={lang} onLang={chLang} snd={snd} onSnd={chSnd} />
        {screen === "home" && (
          <HomeScreen
            t={t}
            onNew={() => setScreen("setup")}
            onHelp={() => setHelp(true)}
          />
        )}
        {screen === "setup" && (
          <GameSetup
            t={t}
            lang={lang}
            onBack={home}
            onStart={(c) => {
              setCfg({ ...c, id: Date.now() });
              setScreen("game");
            }}
          />
        )}
        {screen === "game" && cfg && (
          <GameScreen
            key={cfg.id}
            cfg={cfg}
            t={t}
            lang={lang}
            onHome={home}
            onFinish={(r) => {
              setRes(r);
              setScreen("result");
            }}
          />
        )}
        {screen === "result" && res && (
          <GameResult
            cfg={cfg}
            res={res}
            t={t}
            lang={lang}
            onAgain={() => {
              setCfg({ ...cfg, id: Date.now() });
              setScreen("game");
            }}
            onHome={home}
          />
        )}
        {help && (
          <div className="modal" onClick={() => setHelp(false)}>
            <div className="card" onClick={(e) => e.stopPropagation()}>
              <h2>{t.how}</h2>
              <ol>
                {t.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
              <button className="btn" onClick={() => setHelp(false)}>
                {t.ok}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
