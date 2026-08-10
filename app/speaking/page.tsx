import type { Metadata } from "next";
import { SpeakingPage } from "../../components/speaking/SpeakingPage";

export const metadata: Metadata = {
  title: "Speaking",
  description: "Provisional speaking propositions and formats for Chuka Dele-Oyeleru.",
  robots: { index: false, follow: true },
};

export default function SpeakingRoute() {
  return <SpeakingPage />;
}
