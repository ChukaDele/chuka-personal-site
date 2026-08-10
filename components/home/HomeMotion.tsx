"use client";

import { useEffect } from "react";
import { useSound } from "../sound/SoundProvider";

export function HomeMotion() {
  const { playChapterCue, playScrollCue, setAmbientSection } = useSound();

  useEffect(() => {
    const sections = [
      [".hero", "hero", null],
      [".work-section", "work", "work"],
      [".practice", "practice", "practice"],
      [".library-teaser", "library", "library"],
      [".correspondence", "correspondence", "correspondence"],
    ] as const;
    let activeSection = "";
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = sections.find(([selector]) => visible.target.matches(selector));
      if (!match || activeSection === match[1]) return;
      activeSection = match[1];
      setAmbientSection(match[1]);
      if (match[2]) playChapterCue(match[2]);
    }, { rootMargin: "-28% 0px -48%", threshold: [0.15, 0.35, 0.6] });
    sections.forEach(([selector]) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
    return () => {
      observer.disconnect();
      setAmbientSection(null);
    };
  }, [playChapterCue, setAmbientSection]);

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let cleanup = () => {};
    const eligibility = window.matchMedia("(min-width: 1100px) and (prefers-reduced-motion: no-preference)");

    const start = () => {
      if (!eligibility.matches || started) return;
      started = true;
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const motionMedia = gsap.matchMedia();
      motionMedia.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const heroTimeline = gsap.timeline({
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
          });
          heroTimeline
            .to(".hero-art", { scale: 1.045, yPercent: -3, ease: "none" }, 0)
            .to(".system-node", { x: 0, y: 0, opacity: 1, ease: "power2.inOut" }, 0)
            .to(".hero-system svg", { opacity: 0.9, ease: "power2.inOut" }, 0.12)
            .to(".hero-handoff i", { scaleX: 1, transformOrigin: "left center", ease: "none" }, 0.18)
            .to(".hero-copy", { yPercent: -7, opacity: 0.42, ease: "power1.inOut" }, 0.58)
            .to(".hero-system", { scale: 0.82, xPercent: 8, opacity: 0.55, ease: "power1.inOut" }, 0.58)
            .fromTo(".section-head", { y: 50, opacity: 0.55 }, { y: 0, opacity: 1, immediateRender: false, ease: "power1.out" }, 0.62);

          const practiceTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".practice",
              start: "top top",
              end: "+=200%",
              scrub: 0.75,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const stage = Math.min(5, Math.floor(self.progress * 5) + 1);
                document.querySelector<HTMLElement>("[data-blueprint]")?.setAttribute("data-blueprint-active-state", ["observe", "define", "construct", "organise", "improve"][stage - 1]);
              },
            },
          });
          const blueprintLayers = {
            observe: "[data-blueprint-layer='observe']",
            define: "[data-blueprint-layer='define']",
            construct: "[data-blueprint-layer='construct']",
            organise: "[data-blueprint-layer='organise']",
            improve: "[data-blueprint-layer='improve']",
          };
          const stageItems = gsap.utils.toArray<HTMLElement>(".stage-list li");
          const stageIndicators = gsap.utils.toArray<HTMLElement>(".stage-list li i");

          practiceTimeline
            .set([blueprintLayers.define, blueprintLayers.construct, blueprintLayers.organise, blueprintLayers.improve], { opacity: 0 }, 0)
            .set(blueprintLayers.observe, { opacity: 1 }, 0)
            .set(stageItems.slice(1), { opacity: 0.42, x: 14 }, 0)
            .set(stageIndicators.slice(1), { scaleX: 0.15 }, 0)
            .to(blueprintLayers.observe, { opacity: 0.16, duration: 0.12, ease: "power2.inOut" }, 0.17)
            .fromTo(blueprintLayers.define, { opacity: 0 }, { opacity: 1, duration: 0.13, ease: "power2.inOut", immediateRender: false }, 0.17)
            .to(blueprintLayers.define, { opacity: 0.28, duration: 0.12, ease: "power2.inOut" }, 0.36)
            .fromTo(blueprintLayers.construct, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "power2.inOut", immediateRender: false }, 0.36)
            .fromTo("[data-blueprint-part='module']", { y: 10 }, { y: 0, duration: 0.13, stagger: 0.025, ease: "power2.out", immediateRender: false }, 0.36)
            .to(blueprintLayers.construct, { opacity: 0.62, duration: 0.11, ease: "power2.inOut" }, 0.56)
            .fromTo(blueprintLayers.organise, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power2.inOut", immediateRender: false }, 0.56)
            .fromTo(blueprintLayers.improve, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power2.inOut", immediateRender: false }, 0.76)
            .fromTo("[data-blueprint-loop]", { strokeDashoffset: 620 }, { strokeDashoffset: 0, duration: 0.18, ease: "power2.inOut", immediateRender: false }, 0.76)
            .fromTo("[data-blueprint-part='reinforcement']", { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "power2.out", immediateRender: false }, 0.88);

          practiceTimeline
            .call(() => playScrollCue("threshold"), [], 0.17)
            .call(() => playScrollCue("construction"), [], 0.36)
            .call(() => playScrollCue("threshold"), [], 0.56)
            .call(() => playScrollCue("completion"), [], 0.76);

          stageItems.slice(1).forEach((item, index) => {
            const position = 0.16 + index * 0.18;
            practiceTimeline.to(item, { opacity: 1, x: 0, duration: 0.12, ease: "power1.out" }, position);
            practiceTimeline.to(item.querySelector("i"), { scaleX: 1, duration: 0.12, ease: "power1.out" }, position);
          });

          gsap.timeline({
            scrollTrigger: { trigger: ".correspondence", start: "top bottom", end: "top 20%", scrub: 0.75 },
          })
            .fromTo(".correspondence-grid", { opacity: 0.12, rotateX: 72, scale: 1.8, yPercent: 24 }, { opacity: 0.42, rotateX: 56, scale: 1.5, yPercent: 0, transformPerspective: 800, ease: "none" }, 0)
            .fromTo(".correspondence-copy", { y: 70, opacity: 0.35 }, { y: 0, opacity: 1, ease: "power1.out" }, 0);
        });
        ScrollTrigger.refresh();
        return () => context.revert();
      });

      cleanup = () => motionMedia.revert();
      });
    };
    start();
    eligibility.addEventListener("change", start);
    return () => {
      cancelled = true;
      eligibility.removeEventListener("change", start);
      cleanup();
    };
  }, [playScrollCue]);

  return null;
}
