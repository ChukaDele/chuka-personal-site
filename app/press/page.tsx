import type { Metadata } from "next";
import { PressPage } from "../../components/press/PressPage";

export const metadata: Metadata = {
  title: "Press kit",
  description: "Provisional press, media and speaking material for Chuka Dele-Oyeleru.",
  robots: { index: false, follow: true },
};

export default function PressRoute() {
  return <PressPage />;
}
