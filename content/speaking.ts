export type SpeakingFormat = {
  name: string;
  description: string;
};

export type SpeakingProposition = {
  index: string;
  title: string;
  premise: string;
  evidenceBasis: string[];
  questions: string[];
};

export const speakingFormats: SpeakingFormat[] = [
  {
    name: "Keynotes",
    description: "A clear argument shaped for the room, with a practical route from idea to application.",
  },
  {
    name: "Fireside conversations",
    description: "A candid, moderated exploration of operating choices, trade-offs and unfinished questions.",
  },
  {
    name: "Panels",
    description: "A specific operating perspective in conversation with other disciplines and lived experience.",
  },
  {
    name: "Workshops",
    description: "A participatory session that turns a live problem into a clearer brief, system or next move.",
  },
  {
    name: "Roundtables",
    description: "A small-group exchange designed to surface constraints, compare approaches and leave with useful questions.",
  },
  {
    name: "Podcasts",
    description: "Long-form conversation about how strategy, operations and technology meet in practice.",
  },
];

export const speakingPropositions: SpeakingProposition[] = [
  {
    index: "01",
    title: "From ambiguity to execution",
    premise:
      "How to move from an ambitious but incomplete brief to a first working system, then organise it for repeatable execution.",
    evidenceBasis: [
      "The published operating sequence: observe, define, construct, organise and improve.",
      "Published scope across company operations, process design, proposition design, service architecture and delivery.",
    ],
    questions: [
      "What must be understood before a solution is proposed?",
      "How do you decide what should exist before deciding how to scale it?",
      "When does a useful first version become a repeatable operating system?",
    ],
  },
  {
    index: "02",
    title: "Cross-disciplinary operating without vague generalism",
    premise:
      "How to work across strategy, operations, product, people, data and growth while keeping the problem, ownership and standard of evidence precise.",
    evidenceBasis: [
      "Published work contexts at ETAP, Rvysion and The Bredge.",
      "Published scope spanning people systems, opportunity evaluation, service design, positioning and go-to-market.",
    ],
    questions: [
      "Which discipline does the problem actually require now?",
      "How can teams cross functions without blurring ownership?",
      "What makes breadth useful rather than performative?",
    ],
  },
  {
    index: "03",
    title: "AI as leverage, not outsourced judgement",
    premise:
      "How to use AI to extend research, synthesis, prototyping and operating capacity while keeping context, accountability and consequential decisions human-owned.",
    evidenceBasis: [
      "The published emphasis on connecting people, workflows, data and tools.",
      "The site’s stated practice of using evidence and feedback to improve execution.",
    ],
    questions: [
      "Where does AI create real leverage in operating work?",
      "Which judgements should remain visibly human-owned?",
      "How do teams test AI-assisted work before making it part of the system?",
    ],
  },
];

export const speakingVerificationNote =
  "These are provisional propositions, not a record of prior speaking engagements. Titles, framing and availability remain pending Chuka's verification.";
