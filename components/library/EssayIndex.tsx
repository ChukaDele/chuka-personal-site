import type { EssayCollectionResource } from "../../content/library";
import { AnnotationStatus } from "./AnnotationStatus";
import { ResourceAction } from "../common/ResourceAction";

export function EssayIndex({ collection }: { collection: EssayCollectionResource }) {
  return (
    <section className="essay-index" id="essays" aria-labelledby="essays-title">
      <header>
        <p className="library-section-index">04 / ESSAYS</p>
        <p>COLLECTION · INDEXED AS A BODY OF WORK</p>
      </header>
      <div className="essay-title-block">
        <p aria-hidden="true">PG / 001—∞</p>
        <h2 id="essays-title">{collection.title}</h2>
        <p>Modelled as a collection. No individual essay is presented as a personal favourite.</p>
      </div>
      <div className="essay-rule" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="essay-actions">
        <AnnotationStatus personalNote={collection.personalNote} ideaIKept={collection.ideaIKept} />
        {collection.href ? <ResourceAction href={collection.href} target="_blank" rel="noreferrer" indicator="external">Open the essay index</ResourceAction> : null}
      </div>
    </section>
  );
}
