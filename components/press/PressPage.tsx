"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SiteNav } from "../layout/SiteNav";
import { socialLinks } from "../../content/site";
import { speakingSessions, primarySpeakingFormats, secondarySpeakingFormats } from "../../content/speaking";
import { pressBios, pressPortraits } from "../../content/press";
import styles from "./press.module.css";
import { ResourceAction } from "../common/ResourceAction";
import { MediaFrame } from "../layout/primitives";

function CopyBio({ label, copy }: { label: string; copy: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const resetTimer = useRef<number | null>(null);
  useEffect(() => () => { if (resetTimer.current) window.clearTimeout(resetTimer.current); }, []);
  return <div className={styles.copyControl}><ResourceAction as="button" variant="text" sound="press" onClick={async () => { try { await navigator.clipboard.writeText(copy); setCopied(true); setFailed(false); if (resetTimer.current) window.clearTimeout(resetTimer.current); resetTimer.current = window.setTimeout(() => setCopied(false), 1800); } catch { setFailed(true); } }}>{copied ? "Copied" : `Copy ${label.toLowerCase()}`}</ResourceAction><span className={styles.copyStatus} aria-live="polite">{copied ? `${label} copied.` : failed ? "Copy failed. Select the text above." : ""}</span></div>;
}

export function PressPage() {
  return (
    <main className={styles.page} id="main-content">
      <SiteNav />
      <header className={styles.hero}>
        <div className={styles.heroCopy}><p>Press, media and event hosts</p><h1>Press <em>kit.</em></h1><p>Biographies, portraits, speaking topics and enquiry links for Chuka Dele-Oyeleru.</p><div className={styles.heroActions}><ResourceAction href="/press/chuka-dele-oyeleru-press-pack.zip" download indicator="download" variant="button" sound="press">Download complete press pack <span>ZIP · 2.6 MB</span></ResourceAction><ResourceAction href={socialLinks.linkedin} target="_blank" rel="noreferrer" indicator="external">Enquire on LinkedIn</ResourceAction></div></div>
        <MediaFrame aspect="portrait" focalPoint={{ x: 50, y: 25 }} caption="Chuka Dele-Oyeleru · Strategy & Operations"><Image src="/images/portraits/chuka-press.webp" width="1200" height="1801" priority sizes="(max-width: 1099px) 100vw, 38vw" alt={pressPortraits[0].alt} /></MediaFrame>
      </header>

      <section className={styles.bios} aria-labelledby="bios-title"><header><p className={styles.sectionLabel}>01 / Biographies</p><h2 id="bios-title">Ready to copy.</h2></header><div className={styles.bioList}>{pressBios.map((bio, index) => <article key={bio.label}><div className={styles.bioMeta}><span>{String(index + 1).padStart(2,"0")}</span><h3>{bio.label}</h3></div><p>{bio.copy}</p><CopyBio label={bio.label} copy={bio.copy} /></article>)}</div></section>

      <section className={styles.assets} aria-labelledby="assets-title"><header><p className={styles.sectionLabel}>02 / Portraits</p><div><h2 id="assets-title">Three useful frames.</h2><p>High-resolution JPGs for editorial and event-programme use.</p></div></header><div className={styles.assetGrid}>{pressPortraits.map((portrait) => <article key={portrait.label}><MediaFrame aspect="portrait" focalPoint={{ x: 50, y: 28 }}><Image src={portrait.display} width={portrait.width} height={portrait.height} sizes="(max-width: 1099px) 100vw, 33vw" alt={portrait.alt} /></MediaFrame><div className={styles.assetCopy}><h3>{portrait.label}</h3><p>{portrait.width} × {portrait.height} · JPG</p><ResourceAction href={portrait.download} download indicator="download" sound="press">Download {portrait.label.toLowerCase()}</ResourceAction></div></article>)}</div><p className={styles.useLine}>Identify the subject as Chuka Dele-Oyeleru. Do not use generative editing to change his likeness.</p></section>

      <section className={styles.topics} aria-labelledby="topics-title"><header><p className={styles.sectionLabel}>03 / Speaking</p><h2 id="topics-title">Topics and formats.</h2></header><ol>{speakingSessions.map((topic) => <li key={topic.index}><span>{topic.index}</span><ResourceAction href="/speaking" variant="plain" indicator="forward">{topic.title}</ResourceAction></li>)}</ol><p>{primarySpeakingFormats.map((format) => format.name).join(" · ")} <span>Also available: {secondarySpeakingFormats.join(" · ")}</span></p></section>

      <footer className={styles.footer}><div><p>For bookings and media</p><ResourceAction href={socialLinks.linkedin} target="_blank" rel="noreferrer" indicator="external">Enquire on LinkedIn</ResourceAction></div><nav aria-label="Press kit links"><ResourceAction href="/" variant="compact">Visit Chuka’s website</ResourceAction><ResourceAction href="/speaking" variant="compact">Explore speaking topics</ResourceAction><ResourceAction href="/work" variant="compact">Selected work</ResourceAction></nav></footer>
    </main>
  );
}
