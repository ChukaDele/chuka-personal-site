"use client";

import { usePathname } from "next/navigation";
import { navigation, socialLinks } from "../../content/site";
import { ResourceAction } from "../common/ResourceAction";

export function SiteNav({ inverse = false }: { inverse?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className={`site-nav${inverse ? " site-nav-inverse" : ""}`} aria-label="Primary navigation">
      <ResourceAction className="wordmark" variant="plain" href="/" aria-label="Chuka Dele-Oyeleru, home">
        <span className="wordmark-mark" aria-hidden="true">CD</span>
        <span className="wordmark-name">Chuka Dele-Oyeleru</span>
      </ResourceAction>
      <div className="nav-links">
        {navigation.map((item) => <ResourceAction variant="plain" href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} key={item.href}>{item.label}</ResourceAction>)}
        <ResourceAction href={socialLinks.linkedin} className="nav-profile" variant="button" target="_blank" rel="noreferrer" indicator="external">View LinkedIn</ResourceAction>
      </div>
      <details className="nav-menu">
        <summary aria-label="Navigation menu">Menu</summary>
        <div className="nav-menu-panel">
          {navigation.map((item) => <ResourceAction variant="plain" href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} key={item.href}>{item.label}</ResourceAction>)}
          <ResourceAction variant="plain" href={socialLinks.linkedin} target="_blank" rel="noreferrer" indicator="external">LinkedIn</ResourceAction>
        </div>
      </details>
    </nav>
  );
}
