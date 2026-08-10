"use client";

import { useSound } from "./SoundProvider";

export function SoundToggle() {
  const { enabled, preferenceReady, chooseSound } = useSound();
  if (!preferenceReady) return null;
  return (
    <button
      className="sound-toggle"
      type="button"
      aria-label={enabled ? "Turn site sound off" : "Turn site sound on"}
      aria-pressed={enabled}
      onClick={() => chooseSound(!enabled, !enabled)}
    >
      <span aria-hidden="true">{enabled ? "◒" : "○"}</span>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
