import type { Metadata } from "next";
import { SpeakingPage } from "../../components/speaking/SpeakingPage";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Speaking", description: "Sessions from Chuka Dele-Oyeleru on turning ambiguity into execution, cross-disciplinary operating and AI with human judgement.", path: "/speaking", image: "/images/social/speaking.jpg", imageAlt: "Chuka Dele-Oyeleru smiling in a light grey suit" });

export default function SpeakingRoute() {
  return <SpeakingPage />;
}
