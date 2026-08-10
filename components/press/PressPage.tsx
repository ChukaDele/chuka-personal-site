"use client";

import { useState } from "react";
import Image from "next/image";
import { SiteNav } from "../layout/SiteNav";
import { socialLinks } from "../../content/site";
import { speakingSessions, primarySpeakingFormats, secondarySpeakingFormats } from "../../content/speaking";
import { pressBios, pressPortraits } from "../../content/press";
import styles from "./press.module.css";

function CopyBio({ label, copy }: { label: string; copy: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return <div className={styles.copyControl}><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(copy); setCopied(true); setFailed(false); window.setTimeout(() => setCopied(false), 1800); } catch { setFailed(true); } }}>{copied ? "Copied" : `Copy ${label.toLowerCase()}`}</button><span className={styles.copyStatus} aria-live="polite">{copied ? `${label} copied.` : failed ? "Copy failed. Select the text above." : ""}</span></div>;
}

export function PressPage() {
  return (
    <main className={styles.page} id="main-content">
      <SiteNav />
      <header className={styles.hero}>
        <div className={styles.heroCopy}><p>Press, media and event hosts</p><h1>Press <em>kit.</em></h1><p>Biographies, portraits, speaking topics and enquiry links for Chuka Dele-Oyeleru.</p><div className={styles.heroActions}><a href="/press/chuka-dele-oyeleru-press-pack.zip" download>Download complete press pack <span>ZIP · 2.6 MB</span></a><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">Enquire on LinkedIn <span aria-hidden="true">↗</span></a></div></div>
        <figure><Image src="/images/portraits/chuka-press.webp" width="1200" height="1801" priority sizes="(max-width: 900px) 100vw, 38vw" alt={pressPortraits[0].alt} /><figcaption>Chuka Dele-Oyeleru · Strategy &amp; Operations</figcaption></figure>
      </header>

      <section className={styles.bios} aria-labelledby="bios-title"><header><p className={styles.sectionLabel}>01 / Biographies</p><h2 id="bios-title">Ready to copy.</h2></header><div className={styles.bioList}>{pressBios.map((bio, index) => <article key={bio.label}><div className={styles.bioMeta}><span>{String(index + 1).padStart(2,"0")}</span><h3>{bio.label}</h3></div><p>{bio.copy}</p><CopyBio label={bio.label} copy={bio.copy} /></article>)}</div></section>

      <section className={styles.assets} aria-labelledby="assets-title"><header><p className={styles.sectionLabel}>02 / Portraits</p><div><h2 id="assets-title">Three useful frames.</h2><p>High-resolution JPGs for editorial and event-programme use.</p></div></header><div className={styles.assetGrid}>{pressPortraits.map((portrait) => <article key={portrait.label}><Image src={portrait.display} width={portrait.width} height={portrait.height} sizes="(max-width: 900px) 100vw, 33vw" alt={portrait.alt} /><div><h3>{portrait.label}</h3><p>{portrait.width} × {portrait.height} · JPG</p><a href={portrait.download} download>Download {portrait.label.toLowerCase()} <span aria-hidden="true">↓</span></a></div></article>)}</div><p className={styles.useLine}>Identify the subject as Chuka Dele-Oyeleru. Do not use generative editing to change his likeness.</p></section>

      <section className={styles.topics} aria-labelledby="topics-title"><header><p className={styles.sectionLabel}>03 / Speaking</p><h2 id="topics-title">Topics and formats.</h2></header><ol>{speakingSessions.map((topic) => <li key={topic.index}><span>{topic.index}</span><a href="/speaking">{topic.title}</a></li>)}</ol><p>{primarySpeakingFormats.map((format) => format.name).join(" · ")} <span>Also available: {secondarySpeakingFormats.join(" · ")}</span></p></section>

      <footer className={styles.footer}><div><p>For bookings and media</p><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">Enquire on LinkedIn <span aria-hidden="true">↗</span></a></div><nav aria-label="Press kit links"><a href="/">Visit Chuka’s website</a><a href="/speaking">Explore speaking topics</a><a href="/work">Selected work</a></nav></footer>
    </main>
  );
}
