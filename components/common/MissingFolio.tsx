"use client";

import { useState } from "react";

export function MissingFolio() {
  const [assembled, setAssembled] = useState(false);

  return (
    <div className="missing-canvas" data-assembled={assembled}>
      {[1, 2, 3, 4].map((index) => <i className={`folio-fragment fragment-${index}`} aria-hidden="true" key={index} />)}
      <div className="missing-copy">
        <p className="missing-code">404 · MISSING PAGE</p>
        <h1>This page escaped the system.</h1>
        <p>The route is missing. The useful paths are still in place.</p>
        <div className="missing-actions">
          <a href="/" className="button button-light">Return home <span aria-hidden="true">↗</span></a>
          <a href="/#work" className="text-link">Selected work</a>
          <button className="text-button" type="button" onClick={() => setAssembled((value) => !value)} aria-pressed={assembled}>
            {assembled ? "Disturb the fragments" : "Reassemble the fragments"}
          </button>
        </div>
      </div>
    </div>
  );
}
