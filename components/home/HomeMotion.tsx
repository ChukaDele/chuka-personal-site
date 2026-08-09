"use client";

import { useEffect } from "react";

export function HomeMotion() {
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
            scrollTrigger: { trigger: ".practice", start: "top top", end: "+=180%", scrub: 0.75, pin: true, anticipatePin: 1 },
          });
          practiceTimeline
            .to(".study-loose", { opacity: 0.15, duration: 0.28 }, 0)
            .fromTo(".study-axis", { strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 0.5 }, 0.12)
            .fromTo(".practice-study rect, .practice-study circle", { opacity: 0 }, { opacity: 1, duration: 0.34 }, 0.28);

          document.querySelectorAll<HTMLElement>(".stage-list li").forEach((item, index) => {
            practiceTimeline.to(item, { opacity: 1, x: 0, duration: 0.12 }, 0.08 + index * 0.13);
            practiceTimeline.to(item.querySelector("i"), { scaleX: 1, duration: 0.12 }, 0.08 + index * 0.13);
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
  }, []);

  return null;
}
