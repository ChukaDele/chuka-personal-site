export const navigation = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Speaking", href: "/speaking" },
  { label: "Library", href: "/library" },
  { label: "Notes", href: "/notes" },
  { label: "Résumé", href: "/resume" },
];

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/chuka1",
  instagram: "https://www.instagram.com/doc_mcdavies",
};

export type WorkSlug = "etap" | "rvysion" | "bredge";

export type WorkChapter = {
  index: string;
  title: string;
  description: string;
  result?: string;
};

export type WorkFile = {
  period: string;
  role: string;
  sector: string;
  overview: string;
  chaptersTitle: string;
  chapters: WorkChapter[];
  reflection: string;
  recognition?: string;
};

export const selectedWork = [
  {
    index: "01",
    slug: "etap" as const,
    organisation: "ETAP",
    context: "Insurtech · 2022–2024",
    role: "Senior Operations Manager",
    headline: "Building commercial and operating capacity inside a growing insurtech.",
    description:
      "Built ETAP’s first enterprise channel, redesigned claims handoffs and supported the operating work behind fundraising readiness and expansion.",
    proof: ["Seven-figure enterprise premiums", "57% faster claims turnaround", "2023 Employee of the Year"],
    signals: ["Enterprise channel", "Operations", "Partnerships", "Expansion"],
    href: "/work/etap",
    linkLabel: "Open ETAP work file",
  },
  {
    index: "02",
    slug: "rvysion" as const,
    organisation: "Rvysion",
    context: "Venture studio · Mar 2024–Present",
    role: "Strategy & Operations · Co-founder",
    headline: "Designing the operating model behind a studio that serves clients and builds ventures.",
    description:
      "Connected commercial development, resource allocation and venture building across a 32-person cross-functional studio.",
    proof: ["35% client-base growth", "12% lower operating expenses", "22% more revenue opportunities"],
    signals: ["Commercial", "Operating model", "Venture building"],
    href: "/work/rvysion",
    linkLabel: "Open Rvysion work file",
  },
  {
    index: "03",
    slug: "bredge" as const,
    organisation: "The Bredge",
    context: "Embedded data partner · Current",
    role: "Strategy & Operations",
    headline: "Building the operating model for the data team growing companies can plug into.",
    description:
      "Shaping the positioning, service architecture, technology, delivery model and go-to-market for a senior embedded data partner.",
    proof: ["Positioning", "Service architecture", "Delivery model"],
    signals: ["Operating model", "Technology", "Go-to-market"],
    href: "/work/the-bredge",
    linkLabel: "Open The Bredge work file",
  },
];

export const workFiles: Record<WorkSlug, WorkFile> = {
  etap: {
    period: "2022–2024",
    role: "Senior Operations Manager",
    sector: "Insurtech",
    overview:
      "Chuka joined ETAP in an executive-support and operating capacity, then moved into broader operations leadership. The work expanded across commercial development, partnerships, customer operations, fundraising readiness and market expansion.",
    chaptersTitle: "Three operating problems. Three concrete changes.",
    chapters: [
      {
        index: "01",
        title: "Opening an enterprise channel",
        description:
          "Started with market research, competitive mapping and audience segmentation, then helped construct the pricing, proposition, demo process and first enterprise operating motion.",
        result:
          "Took ETAP’s first enterprise channel from a blank page to seven-figure gross premiums within its first few months.",
      },
      {
        index: "02",
        title: "Rebuilding operating flow",
        description:
          "Redesigned operational handoffs and partnership workflows so claims could move through the organisation with clearer ownership and fewer delays.",
        result: "Reduced claims turnaround by 57%.",
      },
      {
        index: "03",
        title: "Preparing the company to grow",
        description:
          "Supported fundraising readiness through financial modelling, investor materials and data-room work. Helped translate market expansion into operating and regulatory requirements.",
      },
    ],
    reflection:
      "The work reinforced a principle that still shapes Chuka’s approach: growth becomes real only when the commercial ambition, operating flow, ownership and evidence are designed together.",
    recognition: "2023 Employee of the Year · ETAP",
  },
  rvysion: {
    period: "Mar 2024–Present",
    role: "Strategy & Operations · Co-founder",
    sector: "Venture, product, design and growth studio",
    overview:
      "Rvysion combines client work with internal products and ventures. The operating challenge is to allocate attention, people and capital across design, engineering, marketing, operations and product without losing delivery quality or commercial momentum.",
    chaptersTitle: "One studio. Three connected operating systems.",
    chapters: [
      {
        index: "01",
        title: "Commercial",
        description:
          "Worked across offer design, acquisition, partnerships and growth experiments, including a lower-offer segment designed to capture demand the studio was previously losing.",
        result: "Grew the client base by 35% and created 22% more revenue opportunities within six months.",
      },
      {
        index: "02",
        title: "Operating",
        description:
          "Designed management rhythms, resource allocation and cash-flow controls across a documented 32-person team spanning technical and non-technical disciplines.",
        result: "Reduced operating expenses by 12%.",
      },
      {
        index: "03",
        title: "Venture",
        description:
          "Helped move internal opportunities through evaluation, MVP, launch, feedback and iteration while balancing the delivery needs of client work.",
        result: "The internal product ecosystem includes Rayna UI, which has reached more than 11,000 users.",
      },
    ],
    reflection:
      "Rvysion shows why cross-functional work still needs hard choices: which opportunity matters, who owns it, what capacity it receives and how the team learns whether it is working.",
  },
  bredge: {
    period: "Current",
    role: "Strategy & Operations",
    sector: "Embedded data partner",
    overview:
      "The Bredge is a senior embedded data partner for growing businesses. It connects fragmented systems, builds reliable data foundations, automates reporting and turns complex data into answers teams can act on.",
    chaptersTitle: "Turning a proposition into an operable service.",
    chapters: [
      {
        index: "01",
        title: "Position the problem",
        description:
          "Define a clear market promise around the data team growing companies can plug into, without reducing the work to disconnected dashboards or isolated technical tasks.",
      },
      {
        index: "02",
        title: "Design the service",
        description:
          "Connect service architecture, technology, delivery workflow and decision ownership so a project or embedded team can enter a client environment coherently.",
      },
      {
        index: "03",
        title: "Build for repeatability",
        description:
          "Shape go-to-market, delivery standards and feedback loops around a model that can adapt to each company while retaining a dependable operating core.",
      },
    ],
    reflection:
      "This is current venture-building work. The public evidence focuses on the operating model being constructed rather than manufacturing mature outcomes before they exist.",
  },
};

export const operatingStages = [
  { index: "01", title: "Observe", description: "Read the environment, incentives, information and real constraint." },
  { index: "02", title: "Define", description: "Name the outcome that matters and what should actually exist." },
  { index: "03", title: "Construct", description: "Make the first product, process, service or intervention work." },
  { index: "04", title: "Organise", description: "Connect ownership, workflow, people, data, tools and decisions." },
  { index: "05", title: "Improve", description: "Use evidence and feedback to make execution repeatable." },
];
