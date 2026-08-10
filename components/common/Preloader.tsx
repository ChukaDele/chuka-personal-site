"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "../sound/SoundProvider";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [requiresChoice, setRequiresChoice] = useState(false);
  const soundButtonRef = useRef<HTMLButtonElement>(null);
  const quietButtonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (requiresChoice) soundButtonRef.current?.focus();
  }, [requiresChoice]);

  useEffect(() => {
    if (!requiresChoice) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      "body > .skip-link, body > .sound-toggle, main > :not(.preloader)",
    ));
    const newlyInert = targets.filter((target) => !target.hasAttribute("inert"));
    newlyInert.forEach((target) => target.setAttribute("inert", ""));
    document.body.classList.add("sound-gate-open");
    return () => {
      newlyInert.forEach((target) => target.removeAttribute("inert"));
      document.body.classList.remove("sound-gate-open");
    };
  }, [requiresChoice]);

  const enter = (withSound: boolean) => {
    chooseSound(withSound, withSound);
    sessionStorage.setItem("atelier-intro-seen", "true");
    setRequiresChoice(false);
    window.setTimeout(() => setVisible(false), 220);
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      enter(false);
      return;
    }
    if (event.key !== "Tab") return;
    const first = soundButtonRef.current;
    const last = quietButtonRef.current;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  if (!visible) return null;

  return (
    <div className={`preloader${requiresChoice ? " preloader-choice" : ""}`} role={requiresChoice ? "dialog" : undefined} aria-modal={requiresChoice || undefined} aria-label={requiresChoice ? "Choose how to enter the site" : undefined} aria-hidden={requiresChoice ? undefined : true} onKeyDown={requiresChoice ? handleDialogKeyDown : undefined}>
      <div className="preloader-mark">
        <i /><i /><i />
        <span>CD</span>
      </div>
      <p>Observation becomes structure.</p>
      {requiresChoice && (
        <div className="preloader-actions">
          <button ref={soundButtonRef} type="button" onClick={() => enter(true)}>Enter with sound</button>
          <button ref={quietButtonRef} type="button" onClick={() => enter(false)}>Enter quietly</button>
        </div>
      )}
    </div>
  );
}
