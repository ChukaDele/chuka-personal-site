import { SiteNav } from "./layout/SiteNav";
import { socialLinks } from "../content/site";

export function RouteShell({ title, index }: { title: string; index: string }) {
  return (
    <main className="route-shell" id="main-content">
      <SiteNav />
      <section className="route-intro">
        <p className="eyebrow">{index} / PHASE TWO</p>
        <div className="route-copy">
          <h1>{title}</h1>
          <p>This page is intentionally incomplete. Verified material will replace this shell when it is ready to publish.</p>
          <div className="route-actions">
            <a href="/" className="button">Return home <span aria-hidden="true">↗</span></a>
            <a href={socialLinks.linkedin} className="text-link" target="_blank" rel="noreferrer">Professional profile <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
