"use client";

import { useEffect } from "react";

export function HomeMotion() {
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

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
            .to(".hero-handoff i", { scaleX: 1, transformOrigin: "left center", ease: "none" }, 0.18);

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
        });
        ScrollTrigger.refresh();
        return () => context.revert();
      });

      cleanup = () => motionMedia.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
