"use client";

import { useEffect, useState } from "react";
import { useSound } from "../sound/SoundProvider";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [requiresChoice, setRequiresChoice] = useState(false);
  const { preferenceReady, chooseSound } = useSound();

  useEffect(() => {
    if (!preferenceReady) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasPreference = window.localStorage.getItem("atelier-sound-preference") !== null;
    if (reduceMotion || hasPreference || sessionStorage.getItem("atelier-intro-seen")) {
      const immediateTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(immediateTimer);
    }
    if (!hasPreference) {
      const choiceTimer = window.setTimeout(() => setRequiresChoice(true), 0);
      return () => window.clearTimeout(choiceTimer);
    }
  }, [preferenceReady]);

  const enter = (withSound: boolean) => {
    chooseSound(withSound, withSound);
    sessionStorage.setItem("atelier-intro-seen", "true");
    setRequiresChoice(false);
    window.setTimeout(() => setVisible(false), 220);
  };

  if (!visible) return null;

  return (
    <div className={`preloader${requiresChoice ? " preloader-choice" : ""}`} role={requiresChoice ? "region" : undefined} aria-label={requiresChoice ? "Optional site sound" : undefined} aria-hidden={requiresChoice ? undefined : true}>
      <div className="preloader-mark">
        <i /><i /><i />
        <span>CD</span>
      </div>
      <p>{requiresChoice ? "Sound is optional. Choose your preference." : "Observation becomes structure."}</p>
      {requiresChoice && (
        <div className="preloader-actions">
          <button type="button" onClick={() => enter(true)}>Enable sound</button>
          <button type="button" onClick={() => enter(false)}>Keep sound off</button>
        </div>
      )}
    </div>
  );
}
