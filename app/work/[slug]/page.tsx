import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageFooter, PageFrame } from "../../../components/editorial/PageFrame";
import { ProjectMediaPlate } from "../../../components/home/ProjectMediaPlate";
import { selectedWork, workFiles } from "../../../content/site";
import styles from "../../phase-two.module.css";
import { createPageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return selectedWork.map((project) => ({ slug: project.slug === "bredge" ? "the-bredge" : project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = selectedWork.find((item) => (item.slug === "bredge" ? "the-bredge" : item.slug) === slug);
  return project ? createPageMetadata({ title: `${project.organisation} work file`, description: project.description, path: project.href, image: "/images/social/work.jpg", imageAlt: `Chuka Dele-Oyeleru · ${project.organisation}` }) : {};
}

export default async function WorkFilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectIndex = selectedWork.findIndex((item) => (item.slug === "bredge" ? "the-bredge" : item.slug) === slug);
  if (projectIndex < 0) notFound();
  const project = selectedWork[projectIndex];
  const workFile = workFiles[project.slug];
  const previous = selectedWork[(projectIndex + selectedWork.length - 1) % selectedWork.length];
  const next = selectedWork[(projectIndex + 1) % selectedWork.length];

  return <PageFrame>
    <header className={`${styles.hero} ${styles.workFileHero}`}><p className={styles.heroIndex}>{project.index} / WORK FILE</p><div className={styles.heroCopy}><p className={styles.marker}>{project.context}</p><h1>{project.organisation}<br/><em>folio.</em></h1><p>{project.headline}</p></div></header>
    <section className={styles.fileOverview} aria-labelledby="mandate-title"><div><p className={styles.marker}>{workFile.period} · {workFile.sector}</p><h2 id="mandate-title">{project.headline}</h2></div><div><p className={styles.fileRole}>{workFile.role}</p><p>{workFile.overview}</p><h3>Scope</h3><ul className={styles.signals}>{project.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></div></section>
    <section className={styles.caseStudy} aria-labelledby="chapters-title"><header className={styles.caseStudyHead}><p className={styles.marker}>Operating record</p><h2 id="chapters-title">{workFile.chaptersTitle}</h2></header><div className={styles.caseStudyGrid}>{workFile.chapters.map((chapter)=><article key={chapter.index}><p className={styles.marker}>{chapter.index}</p><h3>{chapter.title}</h3><p>{chapter.description}</p>{chapter.result ? <strong>{chapter.result}</strong> : null}</article>)}</div></section>
    {project.slug === "etap" ? <section className={styles.fieldMaterial} aria-labelledby="field-title"><header><p className={styles.marker}>Field material</p><h2 id="field-title">ETAP in context.</h2></header><div className={styles.fieldGrid}><figure><Image src="/images/work/etap-video-still.webp" width="1400" height="777" sizes="(max-width: 899px) 100vw, 58vw" alt="Chuka Dele-Oyeleru speaking in an ETAP for Business video."/><figcaption>ETAP for Business · supplied video still</figcaption></figure><figure><Image src="/images/work/etap-event.webp" width="1200" height="900" sizes="(max-width: 899px) 100vw, 42vw" alt="Chuka Dele-Oyeleru and an ETAP colleague at Insurance Meets Tech 2.0."/><figcaption>Insurance Meets Tech 2.0 · supplied event photograph</figcaption></figure></div></section> : <section className={styles.systemMaterial} aria-labelledby="system-title"><header><p className={styles.marker}>Operating view</p><h2 id="system-title">A system built across connected workstreams.</h2></header><ProjectMediaPlate project={project.slug as "rvysion" | "bredge"}/></section>}
    <section className={styles.fileReflection} aria-labelledby="reflection-title"><p className={styles.marker}>What the work changed</p><div><h2 id="reflection-title">A principle carried forward.</h2><p>{workFile.reflection}</p>{workFile.recognition ? <p className={styles.recognition}>{workFile.recognition}</p> : null}</div></section>
    <nav className={styles.workFileNav} aria-label="Work files"><a href={previous.href}><span>Previous</span>{previous.organisation}</a><a href="/work"><span>Archive</span>All work</a><a href={next.href}><span>Next</span>{next.organisation}</a></nav>
    <PageFooter />
  </PageFrame>;
}
