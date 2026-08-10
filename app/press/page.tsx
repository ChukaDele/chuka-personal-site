import type { Metadata } from "next";
import { PressPage } from "../../components/press/PressPage";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Press kit", description: "Biographies, approved portraits, speaking topics and enquiry links for Chuka Dele-Oyeleru.", path: "/press", image: "/images/social/press.jpg", imageAlt: "Formal portrait of Chuka Dele-Oyeleru" });

export default function PressRoute() {
  return <PressPage />;
}
