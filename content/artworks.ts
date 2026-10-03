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

// Previous direction, retained as historical governance; assets retired by ZIP adoption.
export const retiredArtworks: Artwork[] = [
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

// Source: owner-supplied chuka-site.zip, SHA256
// f0a057b2936eaf5334585668d48def9207db432a69ee7999eb5fdffccae6fbdd.
// Titles/dates/attributions below are transcribed from the archive's captions.
// The archive asserts public-domain status but supplies no original download URLs.
// Do not treat this inventory as independent verification of digital-image provenance.
export const artworks: Artwork[] = [
  ['Saint Jerome in His Study', 'Albrecht Dürer', '1514', 'jerome-mono', 'Home hero; monochrome and tinted variants, animated lion detail'],
  ['The School of Athens', 'Raphael', '1509–11', 'athens-mono', 'Contact picture; monochrome and colour variants'],
  ['The Moneylender and His Wife', 'Quentin Massys', '1514', 'weighing-mono', 'Work page plate'],
  ['The Baptism of Christ', 'Andrea del Verrocchio and workshop', 'c. 1475', 'baptism', 'About page workshop illustration'],
  ['De Divina Proportione', 'Luca Pacioli, with solids after Leonardo', '1509', 'pacioli', 'Library page plate'],
  ['Studies of a hoist after Brunelleschi', 'Leonardo da Vinci', 'c. 1480', 'hoist', 'Notes page plate'],
  ['The Tax Collectors', 'Marinus van Reymerswaele', 'c. 1540', 'ledger', 'Résumé page plate'],
].map(([title, artist, year, asset, intendedUse]) => ({
  title, artist, year, intendedUse,
  institution: 'Not specified in supplied archive',
  source: 'Owner-supplied chuka-site.zip; attribution in src/pages or src/components/Write.astro',
  publicDomain: true,
  rightsStatus: 'Public domain per supplied archive; original digital source unrecorded',
  originalUrl: '',
  localAsset: `/img/${asset}.webp`,
  altTreatment: 'Supplied descriptive alt text and visible attribution preserved.',
}));
