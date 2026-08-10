import { SiteNav } from "../layout/SiteNav";
import styles from "./PageFrame.module.css";
import { ResourceAction } from "../common/ResourceAction";

export function PageFrame({ children, tone = "paper" }: { children: React.ReactNode; tone?: "paper" | "ink" | "blue" }) {
  return (
    <main id="main-content" className={`${styles.frame}${tone === "paper" ? "" : ` ${styles[tone]}`}`}>
      <SiteNav inverse={tone === "ink"} />
      {children}
    </main>
  );
}

export function PageFooter() {
  return (
    <footer className={styles.footer}>
      <span>Chuka Dele-Oyeleru · Strategy &amp; Operations</span>
      <nav aria-label="Footer navigation">
        <ResourceAction href="/" variant="compact">Home</ResourceAction><ResourceAction href="/work" variant="compact">Work</ResourceAction><ResourceAction href="/about" variant="compact">About</ResourceAction><ResourceAction href="/speaking" variant="compact">Speaking</ResourceAction><ResourceAction href="/library" variant="compact">Library</ResourceAction><ResourceAction href="/notes" variant="compact">Notes</ResourceAction><ResourceAction href="/resume" variant="compact">Résumé</ResourceAction><ResourceAction href="/press" variant="compact">Press kit</ResourceAction>
      </nav>
    </footer>
  );
}
