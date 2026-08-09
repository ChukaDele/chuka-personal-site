"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.to(".hero-art", {
        yPercent: -7,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });

      gsap.to(".construction-grid", {
        opacity: 1,
        backgroundSize: "52px 52px",
        scrollTrigger: { trigger: ".hero", start: "42% top", end: "bottom top", scrub: 0.7 },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });
    });

    return () => context.revert();
  }, []);

  return null;
}
