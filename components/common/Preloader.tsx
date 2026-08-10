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
    if (reduceMotion || sessionStorage.getItem("atelier-intro-seen")) {
      const immediateTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(immediateTimer);
    }
    if (!hasPreference) {
      const choiceTimer = window.setTimeout(() => setRequiresChoice(true), 0);
      return () => window.clearTimeout(choiceTimer);
    }
    let active = true;
    const finish = () => {
      if (!active) return;
      sessionStorage.setItem("atelier-intro-seen", "true");
      setVisible(false);
    };
    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, 1050));
    const ready = document.readyState === "complete"
      ? document.fonts.ready
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    Promise.all([minimum, ready]).then(finish);
    const timeout = window.setTimeout(finish, 1150);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
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
