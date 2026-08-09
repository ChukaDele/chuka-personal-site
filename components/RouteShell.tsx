import Link from "next/link";

export function RouteShell({ title, index }: { title: string; index: string }) {
  return (
    <main className="route-shell">
      <nav className="route-nav" aria-label="Primary navigation">
        <Link href="/" className="wordmark">CDO <span>/ Atelier</span></Link>
        <Link href="/">Return home <span aria-hidden="true">↗</span></Link>
      </nav>
      <section className="route-intro">
        <p className="eyebrow">{index} / IN DEVELOPMENT</p>
        <h1>{title}</h1>
        <p>This folio is being prepared with the same care as the work it will contain.</p>
      </section>
    </main>
  );
}
