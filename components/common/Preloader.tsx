"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("atelier-intro-seen")) {
      const immediateTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(immediateTimer);
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
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-mark">
        <i /><i /><i />
        <span>CD</span>
      </div>
      <p>Observation becomes structure.</p>
    </div>
  );
}
