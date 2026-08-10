"use client";

import { useEffect } from "react";
import { useSound } from "../sound/SoundProvider";

export function PracticeMobileController() {
  const { playScrollCue } = useSound();
  useEffect(() => {
    const practice = document.querySelector<HTMLElement>(".practice");
    if (!practice) return;
    const stages = Array.from(practice.querySelectorAll<HTMLElement>(".stage-list li"));
    const media = window.matchMedia("(max-width: 1099px)");
    let observer: IntersectionObserver | null = null;

    const stop = () => {
      observer?.disconnect();
      observer = null;
    };
    const start = () => {
      stop();
      if (!media.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const stage = (visible?.target as HTMLElement | undefined)?.dataset.stage;
        if (stage && practice.dataset.mobileStage !== stage) {
          practice.dataset.mobileStage = stage;
          playScrollCue(stage === "05" ? "completion" : stage === "03" ? "construction" : "threshold");
        }
      }, { rootMargin: "-32% 0px -46%", threshold: [0.2, 0.55, 0.85] });
      stages.forEach((stage) => observer?.observe(stage));
    };

    start();
    media.addEventListener("change", start);
    return () => {
      media.removeEventListener("change", start);
      stop();
    };
  }, [playScrollCue]);

  return null;
}
