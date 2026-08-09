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
