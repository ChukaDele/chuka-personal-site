import { SiteNav } from "../layout/SiteNav";
import { socialLinks } from "../../content/site";
import {
  speakingFormats,
  speakingPropositions,
  speakingVerificationNote,
} from "../../content/speaking";
import styles from "./speaking.module.css";

export function SpeakingPage() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.heroShell}>
        <SiteNav inverse />
        <section className={styles.hero} aria-labelledby="speaking-title">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Speaking / Working propositions</p>
            <p className={styles.provisional}>Provisional · pending Chuka verification</p>
            <h1 id="speaking-title">
              How ambitious work becomes <em>operable.</em>
            </h1>
            <p className={styles.lede}>
              Proposed sessions about ambiguity, cross-disciplinary operating and using AI for leverage without handing over judgement.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                Discuss a possible session <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.secondaryAction} href="/press">
                View press kit <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <aside className={styles.formatLedger} aria-labelledby="format-ledger-title">
            <p id="format-ledger-title">Available formats to verify</p>
            <ol>
              {speakingFormats.map((format, index) => (
                <li key={format.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{format.name}</strong>
                </li>
              ))}
            </ol>
          </aside>
        </section>
        <div className={styles.heroRule} aria-hidden="true">
          <span>Question</span><i /><span>Working proposition</span><i /><span>Conversation</span>
        </div>
      </div>

      <section className={styles.propositions} aria-labelledby="propositions-title">
        <header className={styles.sectionHeader}>
          <p>01 / Propositions in formation</p>
          <div>
            <h2 id="propositions-title">Three arguments to test in public.</h2>
            <p>{speakingVerificationNote}</p>
          </div>
        </header>

        <div className={styles.propositionList}>
          {speakingPropositions.map((proposition) => (
            <article className={styles.proposition} key={proposition.index}>
              <div className={styles.propositionIndex}>
                <span>{proposition.index}</span>
                <p>Provisional</p>
              </div>
              <div className={styles.propositionBody}>
                <h3>{proposition.title}</h3>
                <p className={styles.premise}>{proposition.premise}</p>
                <div className={styles.propositionDetails}>
                  <div>
                    <h4>Evidence basis</h4>
                    <ul>
                      {proposition.evidenceBasis.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4>Questions for the room</h4>
                    <ul>
                      {proposition.questions.map((question) => <li key={question}>{question}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.formats} aria-labelledby="formats-title">
        <header>
          <p>02 / Formats</p>
          <h2 id="formats-title">The format should serve the question.</h2>
        </header>
        <div className={styles.formatGrid}>
          {speakingFormats.map((format) => (
            <article key={format.name}>
              <h3>{format.name}</h3>
              <p>{format.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.engagements} aria-labelledby="engagements-title">
        <p>03 / Verified engagements</p>
        <div>
          <h2 id="engagements-title">No engagement history is published yet.</h2>
          <p>
            Nothing has been inferred or invented. Confirmed events, recordings, hosts and dates can be added after Chuka verifies them.
          </p>
        </div>
      </section>

      <footer className={styles.booking}>
        <p>Booking / interim route</p>
        <h2>Have a room, audience or question in mind?</h2>
        <p>
          Until a direct booking address is verified, LinkedIn is the public contact route.
        </p>
        <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
          Contact Chuka on LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  );
}
