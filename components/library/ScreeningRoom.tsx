"use client";

/* eslint-disable @next/next/no-img-element -- Direct YouTube thumbnails avoid loading the player or image optimiser before consent. */

import { useEffect, useRef, useState } from "react";
import type { VideoResource } from "../../content/library";
import { AnnotationStatus } from "./AnnotationStatus";

export function ScreeningRoom({ videos }: { videos: readonly VideoResource[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const playButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreVideoRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeVideo) {
      closeButtonRef.current?.focus();
      return;
    }
    const videoId = restoreVideoRef.current;
    if (!videoId) return;
    restoreVideoRef.current = null;
    window.requestAnimationFrame(() => playButtonRefs.current.get(videoId)?.focus());
  }, [activeVideo]);

  const closePlayer = (videoId: string) => {
    restoreVideoRef.current = videoId;
    setActiveVideo(null);
  };

  return (
    <section className="screening-room" id="screening-room" aria-labelledby="screening-title">
      <header className="screening-heading">
        <p>02 / SCREENING ROOM</p>
        <h2 id="screening-title">Ideas worth<br /><em>watching closely.</em></h2>
      </header>

      <div className="screening-list">
        {videos.map((video, index) => {
          const isActive = activeVideo === video.id;
          return (
            <article className="screening-item" key={video.id}>
              <div className="projection-frame">
                {isActive ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                    title={`${video.title} by ${video.creator}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    ref={(node) => {
                      if (node) playButtonRefs.current.set(video.id, node);
                      else playButtonRefs.current.delete(video.id);
                    }}
                    className="projection-trigger"
                    type="button"
                    onClick={() => setActiveVideo(video.id)}
                    aria-label={`Play ${video.title} by ${video.creator}`}
                  >
                    {/* A direct thumbnail avoids loading the video iframe or image optimiser before consent. */}
                    <img
                      src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      width="480"
                      height="360"
                    />
                    <span className="projection-shade" aria-hidden="true" />
                    <span className="projection-play" aria-hidden="true">PLAY</span>
                    <span className="projection-index" aria-hidden="true">FILM {String(index + 1).padStart(2, "0")}</span>
                  </button>
                )}
              </div>
              <div className="screening-copy">
                <p>{video.creator}</p>
                <h3>{video.title}</h3>
                <div className="screening-actions">
                  {isActive ? (
                    <button ref={closeButtonRef} type="button" className="library-text-button" onClick={() => closePlayer(video.id)}>Close player</button>
                  ) : null}
                  <a href={video.href} target="_blank" rel="noreferrer">Open on YouTube <span aria-hidden="true">↗</span></a>
                </div>
                <AnnotationStatus personalNote={video.personalNote} ideaIKept={video.ideaIKept} inverse />
              </div>
            </article>
          );
        })}
      </div>
      <noscript><p className="screening-noscript">JavaScript is required for the embedded players. The YouTube links remain available.</p></noscript>
    </section>
  );
}
