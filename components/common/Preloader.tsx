"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("atelier-intro-seen")) {
      const immediateTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(immediateTimer);
    }
    sessionStorage.setItem("atelier-intro-seen", "true");
    let active = true;
    const finish = () => {
      if (active) setVisible(false);
    };
    const timeout = window.setTimeout(finish, 1150);
    if (document.readyState === "complete") {
      document.fonts.ready.then(finish);
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener("load", finish);
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
