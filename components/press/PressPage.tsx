import { SiteNav } from "../layout/SiteNav";
import { socialLinks } from "../../content/site";
import { speakingFormats, speakingPropositions } from "../../content/speaking";
import styles from "./press.module.css";

const bioDrafts = [
  {
    label: "Short bio",
    length: "Approximately 50 words",
    copy:
      "Chuka Dele-Oyeleru works in Strategy & Operations, turning ambiguous, cross-functional problems into systems people can use and improve. His published work contexts include ETAP, Rvysion and The Bredge, spanning company operations, people systems, process design, opportunity evaluation, service design, delivery, positioning and go-to-market. This draft is provisional.",
  },
  {
    label: "Standard bio",
    length: "Approximately 100 words",
    copy:
      "Chuka Dele-Oyeleru works in Strategy & Operations, with a focus on turning ambiguous, cross-functional problems into systems people can use and improve. His published work contexts include ETAP, Rvysion and The Bredge. Across them, his scope spans company operations, people systems, process design, opportunity evaluation, proposition and service design, delivery, positioning and go-to-market. He works by observing the real constraint, defining the useful outcome, constructing a first working intervention, organising ownership and information, and improving execution through evidence and feedback. Chuka is based in London. This draft remains provisional pending his verification for external use.",
  },
  {
    label: "Full bio",
    length: "Working long-form draft",
    copy:
      "Chuka Dele-Oyeleru works in Strategy & Operations from London. He focuses on situations where the desired outcome matters but the route to execution is not yet clear. His work connects strategy, operations, product, people, data and growth, using only the disciplines the problem requires. Across ETAP, Rvysion and The Bredge, his published scope includes company operations, people systems, process design, opportunity evaluation, proposition and service design, delivery, positioning and go-to-market. The common thread is practical: determine what should exist, construct the first working version, organise ownership and information, then improve it through evidence and feedback. His current speaking propositions examine ambiguity-to-execution, cross-disciplinary operating and the responsible use of AI as leverage without outsourcing judgement. These propositions and this biography remain provisional until Chuka confirms them for external use.",
  },
];

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Selected work", href: "/#work" },
  { label: "Operating approach", href: "/#approach" },
  { label: "Speaking", href: "/speaking" },
];

export function PressPage() {
  return (
    <main className={styles.page} id="main-content">
      <SiteNav />

      <header className={styles.hero}>
        <div className={styles.heroIndex}>
          <span>Press / 01</span>
          <span>Working kit</span>
        </div>
        <div className={styles.heroCopy}>
          <p>Press, media and event hosts</p>
          <h1>A working kit, kept <em>honest.</em></h1>
          <p>
            Draft biographies, proposed topics and practical placeholders. Nothing here should be treated as verified for publication until Chuka confirms it.
          </p>
        </div>
      </header>

      <section className={styles.identity} aria-labelledby="identity-title">
        <p className={styles.sectionLabel}>01 / Identity</p>
        <div className={styles.identityGrid}>
          <div>
            <h2 id="identity-title">Chuka Dele-Oyeleru</h2>
            <dl>
              <div><dt>Professional classification</dt><dd>Strategy &amp; Operations</dd></div>
              <div><dt>Location</dt><dd>London</dd></div>
              <div><dt>Pronunciation</dt><dd>Pending Chuka&apos;s phonetic spelling and audio confirmation.</dd></div>
            </dl>
          </div>
          <aside>
            <p>Booking contact</p>
            <h3>LinkedIn is the interim public route.</h3>
            <p>A direct press or booking address has not been verified for publication.</p>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">View LinkedIn <span aria-hidden="true">↗</span></a>
          </aside>
        </div>
      </section>

      <section className={styles.bios} aria-labelledby="bios-title">
        <header>
          <p className={styles.sectionLabel}>02 / Biography drafts</p>
          <div>
            <h2 id="bios-title">Three lengths. All provisional.</h2>
            <p>Verify role wording, scope and current details before copying any draft into event or editorial material.</p>
          </div>
        </header>
        <div className={styles.bioList}>
          {bioDrafts.map((bio, index) => (
            <article key={bio.label}>
              <div className={styles.bioMeta}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{bio.label}</h3><p>{bio.length}</p></div>
              </div>
              <p className={styles.bioCopy}>{bio.copy}</p>
              <p className={styles.draftFlag}>Draft · pending verification</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.topics} aria-labelledby="topics-title">
        <header>
          <p className={styles.sectionLabel}>03 / Topics &amp; formats</p>
          <h2 id="topics-title">Current propositions, not past billing.</h2>
        </header>
        <div className={styles.topicGrid}>
          <div>
            <h3>Provisional topics</h3>
            <ol>
              {speakingPropositions.map((topic) => (
                <li key={topic.index}><span>{topic.index}</span><strong>{topic.title}</strong></li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Possible formats</h3>
            <ul>
              {speakingFormats.map((format) => <li key={format.name}>{format.name}</li>)}
            </ul>
          </div>
        </div>
        <a className={styles.inlineLink} href="/speaking">Read the provisional speaking brief <span aria-hidden="true">→</span></a>
      </section>

      <section className={styles.assets} aria-labelledby="assets-title">
        <header>
          <p className={styles.sectionLabel}>04 / Assets</p>
          <h2 id="assets-title">Use only approved, replaceable material.</h2>
        </header>
        <div className={styles.assetGrid}>
          <article className={styles.photoPlaceholder}>
            <div aria-hidden="true"><span>Photo area</span><i /><i /></div>
            <h3>Approved portraits</h3>
            <p>No press photograph is published yet. Do not substitute generated, scraped or unapproved imagery.</p>
            <span className={styles.status}>Asset pending</span>
          </article>
          <article>
            <p className={styles.assetNumber}>PDF / 01</p>
            <h3>Speaker one-sheet</h3>
            <p>A downloadable one-sheet will follow after topics, biography, pronunciation and contact details are verified.</p>
            <span className={styles.status}>Not published</span>
          </article>
          <article>
            <p className={styles.assetNumber}>Media / 02</p>
            <h3>Showreel &amp; mentions</h3>
            <p>Future verified recordings, host credits, press mentions and publication links will be collected here.</p>
            <span className={styles.status}>No verified entries</span>
          </article>
        </div>
      </section>

      <section className={styles.engagements} aria-labelledby="verified-title">
        <p className={styles.sectionLabel}>05 / Verified engagements</p>
        <div>
          <h2 id="verified-title">The record is intentionally empty.</h2>
          <p>No speaking engagement, podcast appearance, panel, publication or media mention has been added without Chuka&apos;s confirmation.</p>
        </div>
      </section>

      <section className={styles.guidance} aria-labelledby="guidance-title">
        <div>
          <p className={styles.sectionLabel}>06 / Use &amp; credit</p>
          <h2 id="guidance-title">Keep the context attached.</h2>
        </div>
        <ul>
          <li>Confirm the selected biography and time-sensitive details with Chuka before publication.</li>
          <li>Credit photographs to the named photographer or source supplied with the future approved asset.</li>
          <li>Do not generate a likeness, remove a credit, or materially alter an approved portrait without permission.</li>
          <li>Describe propositions as proposed topics until a specific engagement and title are confirmed.</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <div>
          <p>Site links</p>
          <nav aria-label="Press kit links">
            {siteLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          </nav>
        </div>
        <div>
          <p>Interim contact</p>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
        <p>Press kit status · provisional</p>
      </footer>
    </main>
  );
}
