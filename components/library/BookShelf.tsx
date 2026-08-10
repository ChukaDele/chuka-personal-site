import Image from "next/image";
import type { BookResource } from "../../content/library";
import { AnnotationStatus } from "./AnnotationStatus";

export function BookShelf({ books }: { books: readonly BookResource[] }) {
  return (
    <section className="library-books" id="books" aria-labelledby="books-title">
      <header className="library-section-heading">
        <p>01 / BOOKS</p>
        <div>
          <h2 id="books-title">Volumes handled,<br /><em>not displayed.</em></h2>
          <p>Four books kept as working objects: handled, revisited and connected to the ideas around them.</p>
        </div>
      </header>

      <ol className="book-shelf">
        {books.map((book, index) => (
          <li className={`book-object book-${book.tone}`} key={book.id}>
            <div className="book-spine" aria-hidden="true">
              <span>{book.volume}</span>
              <i>{book.title}</i>
            </div>
            <article className="book-cover">
              <a className="book-cover-link" href={book.coverSource} target="_blank" rel="noreferrer" aria-label={`View the source page for ${book.title}`}>
                <Image src={book.cover} width={book.coverWidth} height={book.coverHeight} sizes="(max-width: 700px) 80vw, (max-width: 1050px) 38vw, 18vw" alt={`Cover of ${book.title}${book.creator ? ` by ${book.creator}` : ""}`} />
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </a>
              <div className="book-meta"><p className="book-number">VOL. {book.volume}</p><h3>{book.title}</h3>{book.creator ? <p className="book-creator">{book.creator}</p> : null}</div>
              <AnnotationStatus personalNote={book.personalNote} ideaIKept={book.ideaIKept} inverse={book.tone === "ink"} />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
