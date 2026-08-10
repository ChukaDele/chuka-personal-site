import styles from "./ProjectMediaPlate.module.css";

type StillMedia = {
  kind: "image" | "artefact" | "gif";
  src: string;
  alt: string;
};

type LoopMedia = {
  kind: "loop";
  src: string;
  poster: string;
  label: string;
};

type DiagramMedia = {
  kind: "diagram";
  label: string;
};

export type ProjectMedia = StillMedia | LoopMedia | DiagramMedia;

type ProjectMediaPlateProps = {
  project: "etap" | "rvysion" | "bredge";
  media?: ProjectMedia;
};

function ProjectDiagram({ project }: Pick<ProjectMediaPlateProps, "project">) {
  if (project === "etap") {
    return (
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <path d="M38 54H202M38 102H202M38 150H202M38 198H202M76 38V214M134 38V214M184 38V214" />
        <path className={styles.accent} d="M76 102H184V198H76Z M76 150H184 M134 102V198" />
        <circle cx="184" cy="102" r="7" />
      </svg>
    );
  }

  if (project === "rvysion") {
    return (
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="120" cy="120" r="78" /><circle cx="120" cy="120" r="43" /><circle cx="120" cy="120" r="8" />
        <path className={styles.accent} d="M120 42V198M42 120H198M65 65L175 175M175 65L65 175" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 240" aria-hidden="true">
      <path d="M42 67H93V118H42Z M147 67H198V118H147Z M94 153H146V204H94Z" />
      <path className={styles.accent} d="M93 92H147M172 118L146 153M68 118L94 153" />
      <circle cx="120" cy="92" r="9" />
    </svg>
  );
}

export function ProjectMediaPlate({ project, media = { kind: "diagram", label: "Abstract operating diagram" } }: ProjectMediaPlateProps) {
  return (
    <figure className={`${styles.plate}${project === "etap" ? "" : ` ${styles[project]}`}`} data-media-kind={media.kind}>
      <div className={styles.registration} aria-hidden="true"><i /><i /><i /><i /></div>
      {media.kind === "loop" ? (
        <video className={styles.media} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" aria-label={media.label} />
      ) : media.kind === "image" || media.kind === "artefact" || media.kind === "gif" ? (
        // eslint-disable-next-line @next/next/no-img-element -- Supports supplied artefacts and animated GIFs without transformation.
        <img className={styles.media} src={media.src} alt={media.alt} />
      ) : (
        <ProjectDiagram project={project} />
      )}
      <figcaption>{media.kind === "diagram" ? media.label : media.kind}</figcaption>
    </figure>
  );
}
