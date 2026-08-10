export type AudioAssetId =
  | "atelier-room"
  | "paper-threshold"
  | "chapter-mark"
  | "interaction-press"
  | "book-handle";

export type AudioAsset = {
  id: AudioAssetId;
  source: string;
  creator: string;
  licence: string;
  attributionRequirement: string;
  originalUrl: string;
  localAsset: string;
  usage: string;
};

/**
 * Every shipped sound is original, procedurally generated material. It was
 * rendered for this site from primitive noise and sine sources. No third-party
 * recording, sample pack, song or performance is included.
 */
export const audioManifest: readonly AudioAsset[] = [
  {
    id: "atelier-room",
    source: "Original procedural synthesis rendered locally with FFmpeg lavfi",
    creator: "Chuka personal site production",
    licence: "Original commissioned site asset; cleared for commercial website use",
    attributionRequirement: "None",
    originalUrl: "/audio/atelier-room.m4a",
    localAsset: "/audio/atelier-room.m4a",
    usage: "Subtle filtered room-tone ambient bed for selected site sections",
  },
  {
    id: "paper-threshold",
    source: "Original procedural synthesis rendered locally with FFmpeg lavfi",
    creator: "Chuka personal site production",
    licence: "Original commissioned site asset; cleared for commercial website use",
    attributionRequirement: "None",
    originalUrl: "/audio/paper-threshold.m4a",
    localAsset: "/audio/paper-threshold.m4a",
    usage: "Restrained paper and graphite texture at meaningful scroll thresholds",
  },
  {
    id: "chapter-mark",
    source: "Original procedural synthesis rendered locally with FFmpeg lavfi",
    creator: "Chuka personal site production",
    licence: "Original commissioned site asset; cleared for commercial website use",
    attributionRequirement: "None",
    originalUrl: "/audio/chapter-mark.m4a",
    localAsset: "/audio/chapter-mark.m4a",
    usage: "Tonal chapter transition for major content sections",
  },
  {
    id: "interaction-press",
    source: "Original procedural synthesis rendered locally with FFmpeg lavfi",
    creator: "Chuka personal site production",
    licence: "Original commissioned site asset; cleared for commercial website use",
    attributionRequirement: "None",
    originalUrl: "/audio/interaction-press.m4a",
    localAsset: "/audio/interaction-press.m4a",
    usage: "Short tactile confirmation for selected controls and resource actions",
  },
  {
    id: "book-handle",
    source: "Original procedural synthesis rendered locally with FFmpeg lavfi",
    creator: "Chuka personal site production",
    licence: "Original commissioned site asset; cleared for commercial website use",
    attributionRequirement: "None",
    originalUrl: "/audio/book-handle.m4a",
    localAsset: "/audio/book-handle.m4a",
    usage: "Low paper-and-board cue for deliberate book handling",
  },
] as const;

export const audioAssetById = Object.fromEntries(
  audioManifest.map((asset) => [asset.id, asset]),
) as Record<AudioAssetId, AudioAsset>;
