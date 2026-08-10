import type { Metadata } from "next";
import { PageFooter, PageFrame } from "../../components/editorial/PageFrame";
import { socialLinks } from "../../content/site";
import styles from "../phase-two.module.css";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Résumé",
  description: "The professional record of Chuka Dele-Oyeleru, a Strategy & Operations practitioner based in Manchester, UK.",
  path: "/resume",
});

const experience = [
  {
    organisation: "Rvysion",
    period: "Mar 2024–Present",
    role: "Strategy & Operations · Co-founder",
    description: "Designing the commercial, operating and venture systems behind a 32-person studio that serves client businesses and builds internal products.",
    achievements: [
      "Grew the client base by 35% through acquisition and partnership work.",
      "Reduced operating expenses by 12% through resource, cash-flow and operating management.",
      "Created 22% more revenue opportunities within six months by launching a lower-offer business segment.",
    ],
    href: "/work/rvysion",
  },
  {
    organisation: "ETAP",
    period: "2022–2024",
    role: "Senior Operations Manager",
    description: "Progressed from executive-support and operating work into broader operations leadership inside a growing insurtech.",
    achievements: [
      "Built ETAP’s first enterprise channel from market mapping and pricing through launch to seven-figure gross premiums within its first few months.",
      "Redesigned operational handoffs and partnerships, reducing claims turnaround by 57%.",
      "Supported fundraising readiness, investor materials, data-room work and the operating requirements for market expansion.",
    ],
    href: "/work/etap",
  },
  {
    organisation: "The Bredge",
    period: "Current",
    role: "Strategy & Operations",
    description: "Building the operating model for the senior embedded data team growing companies can plug into.",
    achievements: [
      "Shaping the positioning, offer and service architecture.",
      "Connecting technology, workflow and delivery into a coherent operating model.",
      "Building the go-to-market and feedback loops required for repeatability.",
    ],
    href: "/work/the-bredge",
  },
];

export default function ResumePage() {
  return (
    <PageFrame>
      <header className={styles.hero}>
        <p className={styles.heroIndex}>07 / RÉSUMÉ</p>
        <div className={styles.heroCopy}>
          <h1>Professional <em>record.</em></h1>
          <p>Strategy &amp; Operations work across a scaling insurtech, a cross-functional venture studio and an embedded data business.</p>
        </div>
      </header>

      <section className={styles.resumeSheet} aria-labelledby="resume-name">
        <div className={styles.resumeTop}>
          <div>
            <p className={styles.marker}>MANCHESTER, UK</p>
            <h2 id="resume-name">Chuka Dele-Oyeleru</h2>
            <p>Strategy &amp; Operations</p>
          </div>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">View LinkedIn <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
        </div>

        <div className={styles.resumeExperience}>
          <h3 className={styles.resumeHeading}>Experience</h3>
          {experience.map((item) => (
            <article key={item.organisation}>
              <div className={styles.resumeRecordHead}>
                <div><p className={styles.marker}>{item.period}</p><h4>{item.organisation}</h4></div>
                <p>{item.role}</p>
              </div>
              <p>{item.description}</p>
              <ul>{item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
              <a href={item.href}>Open work file <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>

        <div className={styles.resumeSections}>
          <section aria-labelledby="education-title">
            <h3 id="education-title">Education</h3>
            <div className={styles.resumeItem}><p className={styles.marker}>2025–2027</p><h4>Full-time MBA</h4><p>Alliance Manchester Business School</p></div>
            <div className={styles.resumeItem}><p className={styles.marker}>2016–2021</p><h4>BSc Quantity Surveying</h4><p>University of Lagos</p></div>
          </section>
          <section aria-labelledby="credentials-title">
            <h3 id="credentials-title">Credentials</h3>
            <div className={styles.resumeItem}><h4>SHRM-SCP</h4><p>Society for Human Resource Management</p></div>
            <div className={styles.resumeItem}><h4>Additional certifications</h4><p>Google Project Management · Google Analytics</p></div>
          </section>
        </div>
      </section>
      <PageFooter />
    </PageFrame>
  );
}
