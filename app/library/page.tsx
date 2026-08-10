import type { Metadata } from "next";
import { BookShelf } from "../../components/library/BookShelf";
import { EssayIndex } from "../../components/library/EssayIndex";
import { ListeningRoom } from "../../components/library/ListeningRoom";
import { ScreeningRoom } from "../../components/library/ScreeningRoom";
import { SiteNav } from "../../components/layout/SiteNav";
import { books, essayCollections, podcasts, videos } from "../../content/library";
import "./library.css";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "The Commonplace", description: "A working library of books, films, podcasts and essays that Chuka Dele-Oyeleru returns to.", path: "/library", image: "/images/social/library.jpg", imageAlt: "The Almanack of Naval Ravikant in Chuka's library" });

export default function LibraryPage() {
  return (
    <main className="library-page" id="main-content">
      <SiteNav />
      <header className="library-hero">
        <div className="library-hero-index" aria-hidden="true"><span>LIB.</span><i /></div>
        <div className="library-hero-copy">
          <p>THE COMMONPLACE / A WORKING LIBRARY</p>
          <h1>Ideas kept<br />{" "}within <em>reach.</em></h1>
          <div>
            <p>Books, films, podcasts and essays kept close enough to revisit, question and annotate.</p>
            <nav aria-label="Library sections">
              <a href="#books">Books</a>
              <a href="#screening-room">Films</a>
              <a href="#listening-room">Podcast</a>
              <a href="#essays">Essays</a>
            </nav>
          </div>
        </div>
        <p className="library-hero-note">A commonplace for material worth returning to.</p>
      </header>

      <BookShelf books={books} />
      <ScreeningRoom videos={videos} />
      <ListeningRoom podcast={podcasts[0]} />
      <EssayIndex collection={essayCollections[0]} />

      <footer className="library-footer">
        <p>THE COMMONPLACE · VOLUME 01</p>
        <a href="/">Return to homepage <span aria-hidden="true">↗</span></a>
        <p>Books · films · podcasts · essays</p>
      </footer>
    </main>
  );
}
