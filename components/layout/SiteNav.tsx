"use client";

import { usePathname } from "next/navigation";
import { navigation, socialLinks } from "../../content/site";

export function SiteNav({ inverse = false }: { inverse?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className={`site-nav${inverse ? " site-nav-inverse" : ""}`} aria-label="Primary navigation">
      <a className="wordmark" href="/" aria-label="Chuka Dele-Oyeleru, home">
        <span className="wordmark-mark" aria-hidden="true">CD</span>
        <span className="wordmark-name">Chuka Dele-Oyeleru</span>
      </a>
      <div className="nav-links">
        {navigation.map((item) => <a href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} key={item.href}>{item.label}</a>)}
        <a href={socialLinks.linkedin} className="nav-profile" target="_blank" rel="noreferrer">
          View LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </div>
      <details className="nav-menu">
        <summary aria-label="Navigation menu">Menu</summary>
        <div className="nav-menu-panel">
          {navigation.map((item) => <a href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} key={item.href}>{item.label}</a>)}
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </details>
    </nav>
  );
}
