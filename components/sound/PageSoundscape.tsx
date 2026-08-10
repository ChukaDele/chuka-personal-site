"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSound } from "./SoundProvider";

export function PageSoundscape() {
  const pathname = usePathname();
  const { playChapterCue, setAmbientSection } = useSound();

  useEffect(() => {
    if (pathname === "/") return;
    const section = pathname === "/library" ? "library" : pathname.startsWith("/work") ? "work" : null;
    setAmbientSection(section);
    playChapterCue(section ?? "page");
    return () => setAmbientSection(null);
  }, [pathname, playChapterCue, setAmbientSection]);

  return null;
}
