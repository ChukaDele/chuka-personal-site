export type Artwork = {
  title: string;
  artist: string;
  year: string;
  institution: string;
  source: string;
  publicDomain: boolean;
  rightsStatus: string;
  originalUrl: string;
  localAsset: string;
  intendedUse: string;
  altTreatment: string;
};

export const artworks: Artwork[] = [
  {
    title: "Melencolia I",
    artist: "Albrecht Dürer",
    year: "1514",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access, object 336228",
    publicDomain: true,
    rightsStatus: "Public Domain",
    originalUrl: "https://www.metmuseum.org/art/collection/search/336228",
    localAsset: "/art/durer-melencolia-hero.webp",
    intendedUse: "Hero source and restrained Flow depth study",
    altTreatment: "Decorative crop. Full attribution remains visible in the hero caption.",
  },
  {
    title: "Architecture Study containing Details of One or Several Buildings",
    artist: "Anonymous, Italian, 16th century",
    year: "1490–1510",
    institution: "The Metropolitan Museum of Art",
    source: "The Met Open Access, object 342291",
    publicDomain: true,
    rightsStatus: "Public Domain",
    originalUrl: "https://www.metmuseum.org/art/collection/search/342291",
    localAsset: "/art/renaissance-architecture.webp",
    intendedUse: "Practice section source study",
    altTreatment: "Decorative background supporting the labelled SVG system transformation.",
  },
];
