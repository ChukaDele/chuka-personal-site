import type { BookResource } from "../../content/library";
import { AnnotationStatus } from "./AnnotationStatus";

export function BookShelf({ books }: { books: readonly BookResource[] }) {
  return (
    <section className="library-books" id="books" aria-labelledby="books-title">
      <header className="library-section-heading">
        <p>01 / BOOKS</p>
        <div>
          <h2 id="books-title">Volumes handled,<br /><em>not displayed.</em></h2>
          <p>Four books sit as working objects. Their annotations remain open until Chuka adds the notes that made each one worth keeping.</p>
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
              <p className="book-number">VOL. {book.volume}</p>
              <h3>{book.title}</h3>
              {book.creator ? <p className="book-creator">{book.creator}</p> : null}
              <div className="book-mark" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <AnnotationStatus personalNote={book.personalNote} ideaIKept={book.ideaIKept} inverse={book.tone === "ink"} />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
