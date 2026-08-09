import { Preloader } from "../components/common/Preloader";
import { HomeMotion } from "../components/home/HomeMotion";
import { SiteNav } from "../components/layout/SiteNav";
import { operatingStages, selectedWork, socialLinks } from "../content/site";

export default function Home() {
  return (
    <main id="main-content">
      <Preloader />
      <HomeMotion />

      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <SiteNav inverse />
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-name">CHUKA DELE-OYELERU</p>
            <p className="eyebrow">STRATEGY &amp; OPERATIONS <span>·</span> LONDON</p>
            <h1>I build the systems that take ambitious ideas from first brief to <em>repeatable execution.</em></h1>
            <p className="hero-summary">I work out what needs to be built, design how it should operate, and connect the people, workflows, data and tools required to make it work in practice.</p>
            <div className="hero-actions">
              <a href="#work" className="button button-light">View selected work <span aria-hidden="true">↓</span></a>
              <a href={socialLinks.linkedin} className="text-link" target="_blank" rel="noreferrer">View LinkedIn <span aria-hidden="true">↗</span></a>
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
              </div>
              <div className="folio-visual" aria-hidden="true">
                <span /><span /><span /><span />
                <b>{project.index}</b>
              </div>
            </article>
          ))}
        </div>
        <p className="work-note">Detailed case evidence will be published only when outcomes and artefacts can be verified and shared responsibly.</p>
      </section>

      <section className="practice" id="approach">
        <div className="practice-art" aria-hidden="true" />
        <div className="practice-grid" aria-hidden="true" />
        <div className="practice-intro">
          <p className="section-marker">02 / APPROACH</p>
          <h2>From first brief to <em>repeatable execution.</em></h2>
          <p>A working sequence for bringing a complicated situation into focus, then making it usable.</p>
        </div>
        <div className="practice-sequence">
          <div className="practice-study" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <path className="study-loose" d="M8 29 C20 7 28 83 40 37 S65 20 78 51 S85 89 95 32" />
              <path className="study-axis" d="M14 78 H88 M25 14 V90 M67 8 V88" />
              <rect x="25" y="23" width="42" height="55" />
              <circle cx="46" cy="50" r="13" />
            </svg>
            <p><span>Loose observation</span><span>Working system</span></p>
          </div>
          <ol className="stage-list">
            {operatingStages.map((stage) => (
              <li key={stage.index} data-stage={stage.index}>
                <span>{stage.index}</span><strong>{stage.title}</strong><p>{stage.description}</p><i aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="studio-note">
        <p className="section-marker">03 / STUDIES</p>
        <div><h2>Work in progress stays <em>work in progress.</em></h2><p>This part of the site will hold prototypes, operating experiments and questions that are still being tested. Nothing is presented as finished before it is.</p></div>
      </section>

      <section className="library-teaser">
        <div><p className="section-marker">04 / LIBRARY</p><h2>A library with <em>margin notes.</em></h2></div>
        <div><p>Books, essays, papers, videos, talks, tools and courses will sit beside the ideas they changed, the disagreements they prompted and the work they informed.</p></div>
      </section>

      <section className="about-teaser">
        <p className="section-marker">05 / ABOUT</p>
        <div><h2>The breadth comes from the <em>work.</em></h2><p>I repeatedly work on situations that cross strategy, operations, product, people, data and growth. The point is not to collect disciplines. It is to use the ones a real operating problem requires.</p></div>
      </section>

      <footer className="correspondence">
        <div className="correspondence-grid" aria-hidden="true"><i /><i /><i /><i /></div>
        <p className="section-marker">06 / CORRESPONDENCE</p>
        <div className="correspondence-copy">
          <p className="footer-overline">When the work crosses functions</p>
          <h2>Turn the pieces into a system people can <em>use.</em></h2>
          <a href={socialLinks.linkedin} className="button button-light" target="_blank" rel="noreferrer">View LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
        <div className="footer-meta">
          <span>Chuka Dele-Oyeleru · Strategy &amp; Operations</span>
          <div><a href="/#work">Work</a><a href="/#approach">Approach</a><a href={socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
