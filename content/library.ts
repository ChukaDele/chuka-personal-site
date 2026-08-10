export type LibraryResourceBase = {
  id: string;
  title: string;
  creator?: string;
  href?: string;
  personalNote: string | null;
  ideaIKept?: string | null;
};

export type BookResource = LibraryResourceBase & {
  kind: "book";
  volume: string;
  tone: "oxide" | "ink" | "paper" | "blue";
  cover: string;
  coverSource: string;
  coverWidth: number;
  coverHeight: number;
};

export type VideoResource = LibraryResourceBase & {
  kind: "video";
  youtubeId: string;
};

export type PodcastResource = LibraryResourceBase & {
  kind: "podcast";
  format: "series";
  website: string;
  youtube: string;
  spotify: string;
};

export type EssayCollectionResource = LibraryResourceBase & {
  kind: "essay-collection";
  format: "collection";
};

export const books: readonly BookResource[] = [
  {
    id: "the-alchemist",
    kind: "book",
    volume: "I",
    tone: "oxide",
    title: "The Alchemist",
    creator: "Paulo Coelho",
    cover: "/images/library/the-alchemist.webp",
    coverSource: "https://www.harpercollins.com/products/the-alchemist-paulo-coelho",
    coverWidth: 428,
    coverHeight: 648,
    personalNote: null,
    ideaIKept: null,
  },
  {
    id: "zero-to-one",
    kind: "book",
    volume: "II",
    tone: "ink",
    title: "Zero to One",
    creator: "Peter Thiel with Blake Masters",
    cover: "/images/library/zero-to-one.webp",
    coverSource: "https://www.penguinrandomhouse.com/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/9780804139304/",
    coverWidth: 300,
    coverHeight: 450,
    personalNote: null,
    ideaIKept: null,
  },
  {
    id: "hard-thing-about-hard-things",
    kind: "book",
    volume: "III",
    tone: "paper",
    title: "The Hard Thing About Hard Things",
    creator: "Ben Horowitz",
    cover: "/images/library/hard-thing.webp",
    coverSource: "https://www.harpercollins.com/products/the-hard-thing-about-hard-things-ben-horowitz",
    coverWidth: 429,
    coverHeight: 648,
    personalNote: null,
    ideaIKept: null,
  },
  {
    id: "almanack-of-naval-ravikant",
    kind: "book",
    volume: "IV",
    tone: "blue",
    title: "The Almanack of Naval Ravikant",
    creator: "Eric Jorgenson",
    cover: "/images/library/almanack.webp",
    coverSource: "https://www.navalmanack.com/home",
    coverWidth: 760,
    coverHeight: 1173,
    personalNote: null,
    ideaIKept: null,
  },
] as const;

export const videos: readonly VideoResource[] = [
  {
    id: "success-is-inevitable",
    kind: "video",
    title: "Become Someone For Whom Success Is Inevitable",
    creator: "Alex Hormozi",
    href: "https://www.youtube.com/watch?v=Gk8EGWoGnEQ",
    youtubeId: "Gk8EGWoGnEQ",
    personalNote: null,
    ideaIKept: null,
  },
  {
    id: "destined-to-deal",
    kind: "video",
    title: "Are You Destined to Deal?",
    creator: "Jim Donovan",
    href: "https://www.youtube.com/watch?v=RpUJfW4WTKw",
    youtubeId: "RpUJfW4WTKw",
    personalNote: null,
    ideaIKept: null,
  },
] as const;

export const podcasts: readonly PodcastResource[] = [
  {
    id: "founders-podcast",
    kind: "podcast",
    format: "series",
    title: "Founders",
    creator: "David Senra",
    website: "https://www.founderspodcast.com/",
    youtube: "https://www.youtube.com/@founderspodcast1",
    spotify: "https://open.spotify.com/show/7txiovdzPARhjm18NwMUYj",
    personalNote: null,
    ideaIKept: null,
  },
] as const;

export const essayCollections: readonly EssayCollectionResource[] = [
  {
    id: "paul-graham-essays",
    kind: "essay-collection",
    format: "collection",
    title: "Paul Graham essays",
    creator: "Paul Graham",
    href: "https://paulgraham.com/articles.html",
    personalNote: null,
    ideaIKept: null,
  },
] as const;

export const libraryResources = [
  ...books,
  ...videos,
  ...podcasts,
  ...essayCollections,
] as const;
