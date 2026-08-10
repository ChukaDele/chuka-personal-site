import Image from "next/image";
import { SiteNav } from "../layout/SiteNav";
import { socialLinks } from "../../content/site";
import { primarySpeakingFormats, secondarySpeakingFormats, speakingSessions } from "../../content/speaking";
import styles from "./speaking.module.css";
import { ResourceAction } from "../common/ResourceAction";
import { MediaFrame } from "../layout/primitives";

const portraitAlt = "Chuka Dele-Oyeleru smiling in a light grey suit against a dark studio backdrop.";

export function SpeakingPage() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.heroShell}>
        <SiteNav inverse />
        <section className={styles.hero} aria-labelledby="speaking-title">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Available for speaking</p>
            <h1 id="speaking-title">Turning ambiguity into <em>execution.</em></h1>
            <p className={styles.lede}>Chuka speaks about making ambitious ideas operable, working across disciplines without losing accountability, and using AI as leverage without outsourcing judgement.</p>
            <p className={styles.audience}>For leadership teams, operators, builders and organisations working across functions.</p>
            <div className={styles.actions}>
              <ResourceAction className={styles.primaryAction} variant="button" href={socialLinks.linkedin} target="_blank" rel="noreferrer" indicator="external">Enquire about a session</ResourceAction>
              <ResourceAction className={styles.secondaryAction} href="/press" indicator="forward">Open press kit</ResourceAction>
            </div>
          </div>
          <MediaFrame className={styles.heroPortrait} aspect="portrait" focalPoint={{ x: 50, y: 30 }} caption="Chuka Dele-Oyeleru · Strategy & Operations">
            <Image src="/images/portraits/chuka-speaking.webp" width="1400" height="1751" priority sizes="(max-width: 1099px) 100vw, 38vw" alt={portraitAlt} />
          </MediaFrame>
        </section>
      </div>

      <section className={styles.propositions} aria-labelledby="sessions-title">
        <header className={styles.sectionHeader}>
          <p>01 / Sessions</p>
          <div><h2 id="sessions-title">Three useful arguments for <em>rooms in motion.</em></h2></div>
        </header>
        <div className={styles.propositionList}>
          {speakingSessions.map((session) => (
            <article className={styles.proposition} key={session.index}>
              <div className={styles.propositionIndex}><span>{session.index}</span></div>
              <div className={styles.propositionBody}>
                <h3>{session.title}</h3>
                <p className={styles.premise}>{session.proposition}</p>
                <div className={styles.propositionDetails}>
                  <div><h4>Best-fit audience</h4><ul>{session.audiences.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4>Audience takeaways</h4><ol>{session.takeaways.map((item) => <li key={item}>{item}</li>)}</ol></div>
                </div>
                <p className={styles.sessionFormats}>{session.formats.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.formats} aria-labelledby="formats-title">
        <header><p>02 / Formats</p><h2 id="formats-title">Shape the format around the <em>room.</em></h2></header>
        <div className={styles.formatGrid}>{primarySpeakingFormats.map((format) => <article key={format.name}><h3>{format.name}</h3><p>{format.description}</p></article>)}</div>
        <p className={styles.secondaryFormats}>Also available for {secondarySpeakingFormats.join(" · ")}</p>
      </section>

      <section className={styles.why} aria-labelledby="why-title">
        <Image src="/images/portraits/chuka-about.webp" width="1400" height="1751" sizes="(max-width: 900px) 100vw, 42vw" alt="Chuka Dele-Oyeleru seated in a black T-shirt against a dark studio backdrop." />
        <div><p>03 / Perspective</p><h2 id="why-title">A practitioner’s view from where strategy meets execution.</h2><p>Chuka works on situations that cross strategy, operations, product, people, data and growth. His perspective focuses on determining what should exist, making the first version work, and organising it so people can execute and improve it.</p><ResourceAction href="/work" indicator="forward">See the work behind the talks</ResourceAction></div>
      </section>

      <footer className={styles.booking}>
        <p>Speaking enquiries</p>
        <h2>Planning an event, leadership session or recorded conversation?</h2>
        <p>Share the audience, topic and format you have in mind.</p>
        <div className={styles.actions}><ResourceAction href={socialLinks.linkedin} target="_blank" rel="noreferrer" indicator="external" variant="button">Enquire on LinkedIn</ResourceAction><ResourceAction href="/press" indicator="forward">Open press kit</ResourceAction></div>
      </footer>
    </main>
  );
}
