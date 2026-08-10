export type SpeakingFormat = {
  name: string;
  description: string;
};

export type SpeakingSession = {
  index: string;
  title: string;
  proposition: string;
  audiences: string[];
  takeaways: string[];
  formats: string[];
};

export const primarySpeakingFormats: SpeakingFormat[] = [
  { name: "Keynote", description: "A focused argument shaped around the audience and event brief." },
  { name: "Fireside", description: "A moderated conversation about operating choices, trade-offs and practical experience." },
  { name: "Workshop", description: "A participatory session that turns a live problem into a clearer outcome, operating model or next move." },
];

export const secondarySpeakingFormats = ["Panel", "Roundtable", "Podcast"];

export const speakingSessions: SpeakingSession[] = [
  {
    index: "01",
    title: "From Ambition to Operating Reality",
    proposition: "Ambitious opportunities often reach teams as fragments: a goal, scattered information, unclear ownership and pressure to move. This session shows how to turn that ambiguity into a first working system, then organise it for repeatable execution.",
    audiences: ["Founders and executive teams", "Strategy and operations leaders", "Product, transformation and delivery teams"],
    takeaways: ["Diagnose the real constraint before proposing a solution.", "Define the smallest useful operating outcome.", "Connect ownership, workflow and feedback so execution can improve."],
    formats: ["Keynote · 30–45 minutes", "Workshop · 60–90 minutes", "Fireside"],
  },
  {
    index: "02",
    title: "The Problems That Ignore Org Charts",
    proposition: "Important operating problems rarely stay inside one function. This session explains how to work across strategy, operations, product, people and data while keeping ownership, decisions and evidence precise.",
    audiences: ["Cross-functional leadership teams", "Operators and programme leaders", "Founders navigating organisational growth"],
    takeaways: ["Identify which discipline the problem needs at each stage.", "Cross functional boundaries without creating vague shared ownership.", "Establish decision rights, hand-offs and a common standard of evidence."],
    formats: ["Keynote · 30–45 minutes", "Fireside · 30–45 minutes", "Roundtable or panel"],
  },
  {
    index: "03",
    title: "AI as Leverage, Not Autopilot",
    proposition: "AI can extend research, synthesis, prototyping and operating capacity. It becomes dangerous when speed disguises weak context or unclear accountability. This session shows where AI creates real leverage and where judgement must remain human-owned.",
    audiences: ["Executive and operating teams", "Product and innovation leaders", "Organisations adopting AI in everyday work"],
    takeaways: ["Find tasks where AI increases useful capacity.", "Separate assisted work from consequential human decisions.", "Build validation and accountability into AI-enabled workflows."],
    formats: ["Keynote · 30–45 minutes", "Workshop · 60–90 minutes", "Fireside or podcast"],
  },
];

export const speakingFormats = [...primarySpeakingFormats, ...secondarySpeakingFormats.map((name) => ({ name, description: "Available by arrangement." }))];
export const speakingPropositions = speakingSessions;
