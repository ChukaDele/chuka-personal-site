export type Artwork = {
  title: string;
  artist: string;
  year: string;
  institution: string;
  source: string;
  publicDomain: boolean;
  originalUrl: string;
  localAsset?: string;
  alt: string;
  section: string;
  reason: string;
};

export const artworks: Artwork[] = [
  {
    title: "Ancient Rome",
    artist: "Giovanni Paolo Panini",
    year: "1757",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access",
    publicDomain: true,
    originalUrl: "https://www.metmuseum.org/art/collection/search/437244",
    localAsset: "/art/panini-ancient-rome.jpg",
    alt: "A carefully arranged interior of ancient Roman sculpture and architecture.",
    section: "Hero and selected work",
    reason: "A visual world of observation, collection and constructed environments.",
  },
  {
    title: "Architecture",
    artist: "Michelangelo Colonna",
    year: "17th century",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access",
    publicDomain: true,
    originalUrl: "https://www.metmuseum.org/art/collection/search/399581",
    localAsset: "/art/colonna-architecture.jpg",
    alt: "An architectural pen study with intersecting decorative forms and annotations.",
    section: "Practice",
    reason: "A direct counterpart to the page's move from loose marks to operating structure.",
  },
  {
    title: "Modern Rome",
    artist: "Giovanni Paolo Panini",
    year: "1757",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access",
    publicDomain: true,
    originalUrl: "https://www.metmuseum.org/art/collection/search/437245",
    localAsset: "/art/panini-modern-rome.jpg",
    alt: "A gallery-like view of modern Roman monuments and sculpture.",
    section: "Correspondence",
    reason: "Reuses Panini's visual language to close the page with continuity rather than novelty.",
  },
  {
    title: "Portrait of a Young Man",
    artist: "Bronzino",
    year: "1530s",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access",
    publicDomain: true,
    originalUrl: "https://www.metmuseum.org/art/collection/search/435802",
    alt: "A young man in a dark pleated garment, posed beside a table.",
    section: "Future work folio",
    reason: "Held as a future detail study; it is not used in the Phase 1 page.",
  },
];
