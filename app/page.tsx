import Link from "next/link";
import { HomeMotion } from "../components/home/HomeMotion";

const navItems = ["Work", "Notes", "Library", "About"];
const stages = [
  ["01", "Observe", "Read the environment before prescribing the answer."],
  ["02", "Define", "Name the useful outcome and the constraint that matters."],
  ["03", "Construct", "Make the first product, service, process or intervention work."],
  ["04", "Organise", "Connect ownership, workflow, information, tools and decisions."],
  ["05", "Improve", "Use evidence and feedback to make delivery repeatable."],
];

export default function Home() {
  return (
    <main>
      <HomeMotion />
      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="construction-grid" aria-hidden="true" />
        <nav className="nav" aria-label="Primary navigation">
          <a className="wordmark" href="#top">CDO <span>/ Atelier</span></a>
          <div className="nav-links">
            {navItems.map((item) => <Link href={`/${item.toLowerCase()}`} key={item}>{item}</Link>)}
            <Link href="/resume" className="nav-resume">Résumé <span aria-hidden="true">↗</span></Link>
          </div>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">STRATEGY &amp; OPERATIONS <span>•</span> LONDON, UK</p>
          <h1>I build the systems that take ambitious ideas from first brief to <em>repeatable execution.</em></h1>
          <div className="hero-bottom">
            <p>Across strategy and operations, I work out what needs to be built, design how it should operate, and connect the people, workflows, data and tools required to make it work in practice.</p>
            <a href="#work" className="arrow-link">View selected work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <p className="hero-caption">FIG. 01 — GIOVANNI PAOLO PANINI, <i>ANCIENT ROME</i>, 1757. THE MET OPEN ACCESS.</p>
      </section>

      <section className="intro band" data-reveal>
        <p className="section-marker">01 / PRACTICE</p>
        <div>
          <p className="intro-statement">The work begins with observation. The point is not to make a plan look complete. It is to make the right thing operable.</p>
          <p className="evidence">Across work at ETAP, Rvysion and The Bredge, I have done this inside company operations, new ventures, products and services.</p>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-head" data-reveal><p className="section-marker">02 / SELECTED WORK</p><h2>Evidence,<br /><em>in folios.</em></h2></div>
        <article className="folio folio-etap" data-reveal>
          <p className="folio-number">01</p>
          <div className="folio-content"><p className="eyebrow">ETAP <span>•</span> SENIOR OPERATIONS MANAGER <span>•</span> INSURTECH</p><h3>Building faster, more reliable operations inside a growing insurtech.</h3><p>Operating work that brings structure to a changing business without losing sight of the people doing the work.</p><Link href="/work" className="arrow-link">Open folio <span aria-hidden="true">↗</span></Link></div>
          <div className="folio-diagram" aria-hidden="true"><span>MARKET</span><span>PROCESS</span><span>OWNERSHIP</span><b /></div>
        </article>
        <article className="folio folio-rvysion" data-reveal>
          <p className="folio-number">02</p>
          <div className="folio-content"><p className="eyebrow">RVYSION <span>•</span> CO-FOUNDER <span>•</span> PRODUCT, BRAND &amp; GROWTH</p><h3>Designing the operating system behind an integrated product, brand and growth company.</h3><p>Testing opportunities, shaping propositions and turning cross-functional ambition into delivery that can hold together.</p><Link href="/work" className="arrow-link">Open folio <span aria-hidden="true">↗</span></Link></div>
          <div className="folio-stamp" aria-hidden="true">RV<br />YS<br />ION</div>
        </article>
        <article className="folio folio-bredge" data-reveal>
          <p className="folio-number">03</p>
          <div className="folio-content"><p className="eyebrow">THE BREDGE <span>•</span> CO-FOUNDER <span>•</span> DATA PARTNER</p><h3>Building the operating model for the data team growing companies can plug into.</h3><p>Positioning, service architecture, delivery and go-to-market for an embedded data partner that turns fragmented systems into useful answers.</p><Link href="/work" className="arrow-link">Open folio <span aria-hidden="true">↗</span></Link></div>
          <div className="folio-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        </article>
      </section>

      <section className="practice" data-reveal>
        <div className="practice-art" aria-hidden="true" />
        <div className="practice-grid" aria-hidden="true" />
        <div className="practice-copy"><p className="section-marker">03 / METHOD</p><h2>From first brief to <em>repeatable execution.</em></h2><p>Five moves. Not a rigid recipe. A way to bring a complicated situation into focus, then make it work.</p></div>
        <ol className="stage-list">{stages.map(([number, title, description]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p><i aria-hidden="true" /></li>)}</ol>
      </section>

      <section className="studies band" data-reveal>
        <p className="section-marker">04 / STUDIES</p>
        <div><h2>Things I am testing, building or trying to understand.</h2><p>Some work is not a case study yet. It is a question worth staying with.</p></div>
        <div className="study-index"><span>01 / PRODUCTS</span><span>02 / AI &amp; SYSTEMS</span><span>03 / OPERATING EXPERIMENTS</span></div>
      </section>

      <section className="library" data-reveal>
        <div><p className="section-marker">05 / COMMONPLACE</p><h2>A working library,<br /><em>not a bookshelf.</em></h2></div>
        <div className="library-copy"><p>Books, essays, videos, talks and tools that have shaped how I think and work. Notes and annotations will follow.</p><Link href="/library" className="arrow-link">Enter the library <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="about band" data-reveal>
        <p className="section-marker">06 / ABOUT</p>
        <div><h2>The disciplines are connected by the <em>problems.</em></h2><p>I work where strategy, operations, product, people, data and growth meet. The through-line is not a list of labels. It is building enough clarity for people to move together.</p><div className="about-links"><Link href="/about">More about me <span aria-hidden="true">↗</span></Link><a href="https://www.linkedin.com/in/chuka1" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <footer className="footer" data-reveal>
        <div className="footer-art" aria-hidden="true" />
        <div className="footer-tint" aria-hidden="true" />
        <p className="section-marker">07 / CORRESPONDENCE</p>
        <h2>Some problems need a specialist.<br /><em>Others need someone who can see how the pieces fit together.</em></h2>
        <div className="footer-links"><a href="mailto:hello@chukadele.com">Start a conversation <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/chuka1" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://www.instagram.com/doc_mcdavies" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a></div>
        <p className="footer-meta">© {new Date().getFullYear()} CHUKA DELE-OYELERU <span>•</span> MADE AS A CONTEMPORARY DIGITAL ATELIER</p>
      </footer>
    </main>
  );
}
