import type { Metadata } from "next";
import { HomeMotion } from "../components/home/HomeMotion";
import { PracticeBlueprint } from "../components/home/PracticeBlueprint";
import { PracticeMobileController } from "../components/home/PracticeMobileController";
import { ProjectMediaPlate } from "../components/home/ProjectMediaPlate";
import { SiteNav } from "../components/layout/SiteNav";
import { ResourceAction } from "../components/common/ResourceAction";
import { operatingStages, selectedWork, socialLinks } from "../content/site";
import { absoluteSiteUrl, createPageMetadata, siteUrl } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Chuka Dele-Oyeleru | Strategy & Operations", description: "Chuka Dele-Oyeleru builds the systems that take ambitious ideas from first brief to repeatable execution.", path: "/", imageAlt: "Chuka Dele-Oyeleru, Strategy & Operations", absoluteTitle: true });

export default function Home() {
  return (
    <main id="main-content">
      <link rel="preload" as="image" href="/art/durer-melencolia-hero.webp" type="image/webp" media="(min-width: 681px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/art/durer-melencolia-mobile.webp" type="image/webp" media="(max-width: 680px)" fetchPriority="high" />
      {siteUrl ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", "@id": `${absoluteSiteUrl("/")}#website`, url: absoluteSiteUrl("/"), name: "Chuka Dele-Oyeleru" }, { "@type": "Person", "@id": `${absoluteSiteUrl("/")}#chuka`, name: "Chuka Dele-Oyeleru", jobTitle: "Strategy & Operations", url: absoluteSiteUrl("/"), sameAs: [socialLinks.linkedin] }] }) }} /> : null}
      <HomeMotion />

      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <SiteNav inverse />
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-name">CHUKA DELE-OYELERU</p>
            <p className="eyebrow">STRATEGY &amp; OPERATIONS</p>
            <h1>I build the systems that take ambitious ideas from first brief to <em>repeatable execution.</em></h1>
            <p className="hero-summary">I work out what needs to be built, design how it should operate, and connect the people, workflows, data and tools required to make it work in practice.</p>
            <div className="hero-actions">
              <ResourceAction href="#work" className="button button-light" variant="button" indicator="down">View selected work</ResourceAction>
              <ResourceAction href={socialLinks.linkedin} className="text-link" target="_blank" rel="noreferrer" indicator="external">View LinkedIn</ResourceAction>
            </div>
          </div>
          <div className="hero-system" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M12 20 L40 38 L77 15 M40 38 L71 69 L91 45 M22 83 L71 69" />
              <circle cx="40" cy="38" r="1.4" /><circle cx="71" cy="69" r="1.4" />
            </svg>
            {['Opportunity', 'People', 'Ownership', 'Workflow', 'Data', 'Tools', 'Feedback'].map((label, index) => (
              <span className={`system-node system-node-${index + 1}`} key={label}>{label}</span>
            ))}
          </div>
        </div>
        <div className="hero-handoff" aria-hidden="true"><span>AMBIGUITY</span><i /><span>STRUCTURE</span></div>
        <p className="art-caption">FIG. 01 · ALBRECHT DÜRER, <i>MELENCOLIA I</i>, 1514 · THE MET OPEN ACCESS</p>
      </section>

      <section className="work-section" id="work">
        <header className="section-head">
          <div><p className="section-marker">01 / SELECTED WORK</p><p className="section-kicker">Three contexts. One operating thread.</p></div>
          <h2>Making ambitious work <em>operable.</em></h2>
        </header>
        <div className="work-stack">
          {selectedWork.map((project, projectIndex) => (
            <article className={`work-folio work-folio-${project.slug}`} style={{ "--folio-index": projectIndex } as React.CSSProperties} key={project.slug}>
              <div className="folio-index"><span>{project.index}</span><p>{project.organisation}</p></div>
              <div className="folio-copy">
                <p className="eyebrow">{project.context}</p>
                <h3>{project.headline}</h3>
                <p>{project.description}</p>
                <ul aria-label={`${project.organisation} areas`}>
                  {project.signals.map((signal) => <li key={signal}>{signal}</li>)}
                </ul>
                <ResourceAction className="folio-link" href={project.href} indicator="forward">{project.linkLabel}</ResourceAction>
              </div>
              <ProjectMediaPlate project={project.slug as "etap" | "rvysion" | "bredge"} />
            </article>
          ))}
        </div>
        <ResourceAction className="text-link work-archive-link" href="/work" indicator="forward">Browse the work archive</ResourceAction>
      </section>

      <section className="practice" id="approach" data-mobile-stage="01" tabIndex={-1}>
        <PracticeMobileController />
        <div className="practice-art" aria-hidden="true" />
        <div className="practice-grid" aria-hidden="true" />
        <div className="practice-intro">
          <p className="section-marker">02 / APPROACH</p>
          <h2>From first brief to <em>repeatable execution.</em></h2>
          <p>A working sequence for bringing a complicated situation into focus, then making it usable.</p>
        </div>
        <div className="practice-sequence">
          <PracticeBlueprint />
          <ol className="stage-list">
            {operatingStages.map((stage) => (
              <li key={stage.index} data-stage={stage.index}>
                <span>{stage.index}</span><strong>{stage.title}</strong><p>{stage.description}</p><i aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="library-teaser">
        <div><p className="section-marker">03 / LIBRARY</p><h2>A working <em>library.</em></h2></div>
        <div><p>Books, essays, papers, videos, talks, tools and courses gathered as a practical reference shelf.</p><ResourceAction className="text-link" href="/library" indicator="forward">Enter the Commonplace</ResourceAction></div>
      </section>

      <section className="about-teaser">
        <p className="section-marker">04 / ABOUT</p>
        <div><h2>The breadth comes from the <em>work.</em></h2><p>I repeatedly work on situations that cross strategy, operations, product, people, data and growth. The point is not to collect disciplines. It is to use the ones a real operating problem requires.</p><ResourceAction className="text-link" href="/about" indicator="forward">Read the working principles</ResourceAction></div>
      </section>

      <footer className="correspondence">
        <div className="correspondence-grid" aria-hidden="true"><i /><i /><i /><i /></div>
        <p className="section-marker">05 / CORRESPONDENCE</p>
        <div className="correspondence-copy">
          <p className="footer-overline">When the work crosses functions</p>
          <h2>Turn the pieces into a system people can <em>use.</em></h2>
          <ResourceAction href={socialLinks.linkedin} className="button button-light" variant="button" target="_blank" rel="noreferrer" indicator="external">View LinkedIn</ResourceAction>
        </div>
        <div className="footer-meta">
          <span>Chuka Dele-Oyeleru · Strategy &amp; Operations</span>
          <div><ResourceAction href="/work" variant="compact">Work</ResourceAction><ResourceAction href="/about" variant="compact">About</ResourceAction><ResourceAction href="/speaking" variant="compact">Speaking</ResourceAction><ResourceAction href="/library" variant="compact">Library</ResourceAction><ResourceAction href="/resume" variant="compact">Résumé</ResourceAction><ResourceAction href="/press" variant="compact">Press kit</ResourceAction></div>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
