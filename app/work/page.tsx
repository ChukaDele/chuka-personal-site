import type { Metadata } from "next";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import { ProjectMediaPlate } from "../../components/home/ProjectMediaPlate";
import { ContentFrame } from "../../components/layout/primitives";
import { selectedWork } from "../../content/site";
import styles from "../phase-two.module.css";
import { createPageMetadata } from "../../lib/seo";
export const metadata: Metadata = createPageMetadata({ title: "Selected work", description: "A scannable archive of Chuka Dele-Oyeleru's work across ETAP, Rvysion and The Bredge.", path: "/work", image: "/images/social/work.jpg", imageAlt: "Chuka Dele-Oyeleru in an ETAP for Business video" });
export default function WorkPage() {
  return <PageFrame>
    <header className={styles.hero}><p className={styles.heroIndex}>01 / WORK</p><div className={styles.heroCopy}><h1>Selected <em>work.</em></h1><p>Three operating contexts connected by one repeated task: turning a broad ambition into something people can run, inspect and improve.</p></div></header>
    <section className={styles.workArchive} aria-label="Project archive">
      <ContentFrame className={styles.workArchiveFrame} size="wide">
        {selectedWork.map((project) => <article className={styles.case} key={project.slug}><span className={styles.caseNumber}>{project.index}</span><div><p className={styles.marker}>{project.context}</p><h2>{project.headline}</h2><p className={styles.caseRole}>{project.role}</p><p>{project.description}</p><ol className={styles.proofList} aria-label={`${project.organisation} evidence`}>{project.proof.map(item=><li key={item}>{item}</li>)}</ol><ul className={styles.signals}>{project.signals.map(signal=><li key={signal}>{signal}</li>)}</ul><a className={styles.caseLink} href={project.href}>{project.linkLabel} <span aria-hidden="true">→</span></a></div><ProjectMediaPlate project={project.slug} /></article>)}
      </ContentFrame>
    </section>
    <PageFooter />
  </PageFrame>;
}
