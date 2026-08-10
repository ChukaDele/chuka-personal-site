import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import styles from "./LayoutPrimitives.module.css";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ContentFrameSize = "narrow" | "standard" | "wide";

interface ContentFrameProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContentFrameSize;
}

export function ContentFrame({
  children,
  className,
  size = "standard",
  ...props
}: ContentFrameProps) {
  return (
    <div className={classes(styles.contentFrame, styles[size], className)} {...props}>
      {children}
    </div>
  );
}

type SectionSpace = "compact" | "standard" | "large";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  space?: SectionSpace;
}

export function Section({
  children,
  className,
  space = "standard",
  ...props
}: SectionProps) {
  return (
    <section className={classes(styles.section, styles[`section-${space}`], className)} {...props}>
      {children}
    </section>
  );
}

type FlowGap = "copy" | "content" | "section";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: FlowGap;
}

export function Stack({ children, className, gap = "content", ...props }: StackProps) {
  return (
    <div className={classes(styles.stack, styles[`gap-${gap}`], className)} {...props}>
      {children}
    </div>
  );
}

interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "baseline";
  gap?: "small" | "standard" | "large";
  justify?: "start" | "center" | "between" | "end";
}

export function Cluster({
  align = "center",
  children,
  className,
  gap = "standard",
  justify = "start",
  ...props
}: ClusterProps) {
  return (
    <div
      className={classes(
        styles.cluster,
        styles[`align-${align}`],
        styles[`cluster-gap-${gap}`],
        styles[`justify-${justify}`],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface EditorialGridProps extends HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
  layout?: "editorial" | "folio";
}

/**
 * Direct children can select a named alignment track with
 * data-track="meta", "copy", "media", "secondary", or "full".
 */
export function EditorialGrid({
  children,
  className,
  containerClassName,
  layout = "editorial",
  ...props
}: EditorialGridProps) {
  return (
    <div className={classes(styles.gridContainer, containerClassName)}>
      <div className={classes(styles.editorialGrid, styles[layout], className)} {...props}>
        {children}
      </div>
    </div>
  );
}

type MediaAspect = "natural" | "square" | "portrait" | "landscape" | "cinematic";

interface MediaFrameProps extends HTMLAttributes<HTMLElement> {
  aspect?: MediaAspect;
  bleed?: boolean;
  caption?: ReactNode;
  fit?: "cover" | "contain";
  focalPoint?: { x: number; y: number };
}

type MediaStyle = CSSProperties & {
  "--media-focal-x"?: string;
  "--media-focal-y"?: string;
};

function percentage(value: number) {
  return `${Math.min(100, Math.max(0, value))}%`;
}

export function MediaFrame({
  aspect = "landscape",
  bleed = false,
  caption,
  children,
  className,
  fit = "cover",
  focalPoint = { x: 50, y: 50 },
  style,
  ...props
}: MediaFrameProps) {
  const mediaStyle: MediaStyle = {
    ...style,
    "--media-focal-x": percentage(focalPoint.x),
    "--media-focal-y": percentage(focalPoint.y),
  };

  return (
    <div className={styles.mediaContainer}>
      <figure
        className={classes(
          styles.mediaFrame,
          styles[`aspect-${aspect}`],
          styles[`fit-${fit}`],
          bleed && styles.bleed,
          className,
        )}
        style={mediaStyle}
        {...props}
      >
        <div className={styles.mediaBody}>{children}</div>
        {caption ? <figcaption className={styles.mediaCaption}>{caption}</figcaption> : null}
      </figure>
    </div>
  );
}
