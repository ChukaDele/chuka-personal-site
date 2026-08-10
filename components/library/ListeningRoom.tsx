import type { PodcastResource } from "../../content/library";
import { AnnotationStatus } from "./AnnotationStatus";

export function ListeningRoom({ podcast }: { podcast: PodcastResource }) {
  return (
    <section className="listening-room" id="listening-room" aria-labelledby="listening-title">
      <div className="tape-object" aria-hidden="true">
        <div className="tape-label">
          <span>ARCHIVE / SERIES</span>
          <strong>FOUNDERS</strong>
          <i>DAVID SENRA</i>
        </div>
        <div className="tape-window"><i /><i /><span /></div>
        <div className="tape-waveform">{Array.from({ length: 31 }, (_, index) => <i key={index} />)}</div>
      </div>
      <div className="listening-copy">
        <p className="library-section-index">03 / LISTENING ROOM</p>
        <h2 id="listening-title">A long-running study<br />of <em>people who built.</em></h2>
        <p className="listening-format">Podcast series</p>
        <h3>{podcast.title}</h3>
        <p>By {podcast.creator}</p>
        <AnnotationStatus personalNote={podcast.personalNote} ideaIKept={podcast.ideaIKept} />
      </div>
    </section>
  );
}
