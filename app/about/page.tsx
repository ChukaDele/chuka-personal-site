import type { Metadata } from "next";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import styles from "../phase-two.module.css";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "About" };
const principles = [
  ["Start with the real constraint", "The first brief is rarely the whole problem. Read the environment, incentives and information before prescribing a system."],
  ["Make ownership visible", "A plan becomes operable when decisions, responsibilities and hand-offs are clear."],
  ["Use the discipline the problem needs", "Strategy, operations, product, people, data and growth are inputs, not identity labels."],
  ["Build for use", "The work has to survive contact with the team that will run it."],
  ["Improve from evidence", "Feedback belongs inside the system, not in a retrospective added after delivery."],
];
export default function AboutPage() { return <PageFrame tone="blue"><header className={styles.hero}><p className={styles.heroIndex}>05 / ABOUT</p><div className={styles.heroCopy}><h1>The breadth comes from the <em>work.</em></h1><p>Chuka Dele-Oyeleru works across Strategy &amp; Operations. The common thread is making ambiguous, cross-functional work usable.</p></div></header><section className={styles.aboutBody}><p className={styles.aboutStatement}>Not a collection of disciplines. A way of seeing the whole operating problem.</p><ol className={styles.principles}>{principles.map(([title,body])=><li key={title}><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol></section><PageFooter /></PageFrame>; }
