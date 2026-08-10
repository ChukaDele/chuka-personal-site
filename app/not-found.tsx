import type { Metadata } from "next";
import { MissingFolio } from "../components/common/MissingFolio";
import { SiteNav } from "../components/layout/SiteNav";

export default function NotFound() {
  return (
    <main className="missing-page" id="main-content">
      <SiteNav inverse />
      <MissingFolio />
    </main>
  );
}
export const metadata: Metadata = { title: "Missing folio", robots: { index: false, follow: false } };
