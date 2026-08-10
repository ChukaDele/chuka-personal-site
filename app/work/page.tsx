import type { Metadata } from "next";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import { ProjectMediaPlate } from "../../components/home/ProjectMediaPlate";
import { selectedWork } from "../../content/site";
import styles from "../phase-two.module.css";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Work" };
export default function WorkPage() {
  return <PageFrame>
    <header className={styles.hero}><p className={styles.heroIndex}>01 / WORK</p><div className={styles.heroCopy}><h1>Selected <em>work.</em></h1><p>Three operating contexts connected by one repeated task: turning a broad ambition into something people can run, inspect and improve.</p></div></header>
    <aside className={styles.notice}><strong>Evidence policy</strong><span>Only verified, shareable outcomes and artefacts will be published. The structures below are ready for source material without pretending that missing evidence already exists.</span></aside>
    <section className={styles.workArchive} aria-label="Project archive">
      {selectedWork.map((project) => <article className={styles.case} key={project.slug}><span className={styles.caseNumber}>{project.index}</span><div><p className={styles.marker}>{project.context}</p><h2>{project.headline}</h2><p>{project.description}</p><ul className={styles.signals}>{project.signals.map(signal=><li key={signal}>{signal}</li>)}</ul></div><ProjectMediaPlate project={project.slug as "etap" | "rvysion" | "bredge"} /></article>)}
    </section>
    <section className={styles.caseStudy}><div className={styles.caseStudyHead}><p className={styles.marker}>ETAP / CASE ARCHITECTURE</p><h2>A substantive case will begin with the mandate, not a moodboard.</h2></div><div className={styles.caseStudyGrid}><article><h3>Starting condition</h3><p>Initial operating context, constraints and scale will be added from verified source material.</p></article><article><h3>Decisions and build</h3><p>Chuka’s ownership, collaborators, interventions and implementation sequence will be made explicit.</p></article><article><h3>Evidence and lesson</h3><p>Outcomes, artefacts and what changed will appear only where they can be responsibly substantiated.</p></article></div></section>
    <PageFooter />
  </PageFrame>;
}
