import type { Metadata } from "next";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import styles from "../phase-two.module.css";
import { createPageMetadata } from "../../lib/seo";
export const metadata: Metadata = createPageMetadata({ title: "Notes", description: "Chuka Dele-Oyeleru's working notebook on operating systems, AI and judgement.", path: "/notes" });
const shelves = [["Operating systems","Ownership, workflows and repeatable execution."],["AI and judgement","Leverage, tools and human responsibility."],["Building in public","Experiments and lessons from making work operable."]];
export default function NotesPage() { return <PageFrame><header className={styles.hero}><p className={styles.heroIndex}>04 / NOTES</p><div className={styles.heroCopy}><h1>The working <em>notebook.</em></h1><p>Questions and observations from the space between an ambitious idea and the system that makes it real.</p></div></header><section className={styles.notebook}><div className={styles.noteIndex}>{shelves.map(([title,body])=><article className={styles.noteColumn} key={title}><p className={styles.marker}>INDEX</p><h2>{title}</h2><p>{body}</p></article>)}</div></section><PageFooter /></PageFrame>; }
