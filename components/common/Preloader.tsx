"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "../sound/SoundProvider";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [requiresChoice, setRequiresChoice] = useState(false);
  const [exiting, setExiting] = useState(false);
  const soundButtonRef = useRef<HTMLButtonElement>(null);
  const { preferenceReady, chooseSound } = useSound();

  useEffect(() => {
    if (!preferenceReady) return;
    const hasPreference = window.localStorage.getItem("atelier-sound-preference") !== null;
    if (hasPreference || sessionStorage.getItem("atelier-intro-seen")) {
      const immediateTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(immediateTimer);
    }
    if (!hasPreference) {
      const choiceTimer = window.setTimeout(() => setRequiresChoice(true), 0);
      return () => window.clearTimeout(choiceTimer);
    }
  }, [preferenceReady]);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main");
    if (!requiresChoice || !main) return;
    const inertTargets = [
      ...Array.from(main.children).filter((element) => !element.classList.contains("preloader")),
      document.querySelector(".skip-link"),
      document.querySelector(".sound-toggle"),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);
    inertTargets.forEach((element) => element.setAttribute("inert", ""));
    soundButtonRef.current?.focus();
    const dialog = document.querySelector<HTMLElement>(".preloader-choice");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inertTargets.forEach((element) => element.removeAttribute("inert"));
    };
  }, [requiresChoice]);

  const enter = (withSound: boolean) => {
    chooseSound(withSound, withSound);
    sessionStorage.setItem("atelier-intro-seen", "true");
    setExiting(true);
    window.setTimeout(() => {
      setRequiresChoice(false);
      setVisible(false);
      document.querySelector<HTMLElement>(".wordmark")?.focus();
    }, 180);
  };

  if (!visible) return null;

  return (
    <div className={`preloader${requiresChoice ? " preloader-choice" : ""}${exiting ? " preloader-exiting" : ""}`} role={requiresChoice ? "dialog" : undefined} aria-modal={requiresChoice ? true : undefined} aria-label={requiresChoice ? "Choose site sound" : undefined} aria-hidden={requiresChoice ? undefined : true}>
      <div className="preloader-mark">
        <i /><i /><i />
        <span>CD</span>
      </div>
      <p>{requiresChoice ? "Sound is optional and can be changed at any time." : "Observation becomes structure."}</p>
      {requiresChoice && (
        <div className="preloader-actions">
          <button ref={soundButtonRef} type="button" onClick={() => enter(true)}>ENTER WITH SOUND</button>
          <button type="button" onClick={() => enter(false)}>ENTER QUIETLY</button>
        </div>
      )}
    </div>
  );
}
