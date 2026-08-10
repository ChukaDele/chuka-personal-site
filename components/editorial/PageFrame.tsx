import { SiteNav } from "../layout/SiteNav";
import styles from "./PageFrame.module.css";

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
        <a href="/">Home</a><a href="/work">Work</a><a href="/library">Library</a><a href="/speaking">Speaking</a>
      </nav>
    </footer>
  );
}
