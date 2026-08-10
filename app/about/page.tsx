import type { Metadata } from "next";
import Image from "next/image";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import styles from "../phase-two.module.css";
import { createPageMetadata } from "../../lib/seo";
import { absoluteSiteUrl, siteUrl } from "../../lib/seo";
import { socialLinks } from "../../content/site";
export const metadata: Metadata = createPageMetadata({ title: "About", description: "About Chuka Dele-Oyeleru and his approach to Strategy & Operations.", path: "/about", image: "/images/social/about.jpg", imageAlt: "Portrait of Chuka Dele-Oyeleru" });
const principles = [
  ["Start with the real constraint", "The first brief is rarely the whole problem. I read the environment, incentives and information before prescribing a system."],
  ["Make ownership visible", "A plan becomes operable when decisions, responsibilities and hand-offs are clear."],
  ["Use the discipline the problem needs", "Strategy, operations, product, people, data and growth are inputs, not identity labels."],
  ["Build for use", "The work has to survive contact with the team that will run it."],
  ["Improve from evidence", "Feedback belongs inside the system, not in a retrospective added after delivery."],
];
export default function AboutPage() { return <PageFrame tone="blue">
  {siteUrl ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ProfilePage", "@id": `${absoluteSiteUrl("/about")}#profile`, url: absoluteSiteUrl("/about"), name: "About Chuka Dele-Oyeleru", mainEntity: { "@type": "Person", "@id": `${absoluteSiteUrl("/")}#chuka`, name: "Chuka Dele-Oyeleru", jobTitle: "Strategy & Operations", url: absoluteSiteUrl("/"), sameAs: [socialLinks.linkedin] } }) }} /> : null}
  <header className={`${styles.hero} ${styles.aboutHero}`}><p className={styles.heroIndex}>05 / ABOUT</p><div className={styles.heroCopy}><h1>The breadth comes from the <em>work.</em></h1><p>I work across Strategy &amp; Operations. The common thread is making ambiguous, cross-functional work usable.</p></div><figure><Image src="/images/portraits/chuka-about.webp" width="1400" height="1751" priority sizes="(max-width: 899px) 100vw, 38vw" alt="Chuka Dele-Oyeleru seated in a black T-shirt against a dark studio backdrop."/></figure></header>
  <section className={styles.aboutIntro}><p className={styles.marker}>Working across the whole problem</p><div><h2>I build where strategy meets execution.</h2><p>My work repeatedly crosses company operations, people systems, product, data, proposition, service design and go-to-market. The point is not to collect disciplines. It is to use the ones a real operating problem requires, then connect them into something people can run and improve.</p><nav aria-label="About routes"><a href="/work">Explore selected work →</a><a href="/speaking">Explore speaking topics →</a></nav></div></section>
  <section className={styles.aboutBody}><p className={styles.aboutStatement}>A way of seeing the whole operating problem.</p><ol className={styles.principles}>{principles.map(([title,body])=><li key={title}><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol></section><PageFooter />
</PageFrame>; }
