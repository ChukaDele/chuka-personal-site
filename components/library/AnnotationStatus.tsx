type AnnotationStatusProps = {
  personalNote: string | null;
  ideaIKept?: string | null;
  inverse?: boolean;
};

export function AnnotationStatus({ personalNote, ideaIKept, inverse = false }: AnnotationStatusProps) {
  const hasAnnotation = Boolean(personalNote || ideaIKept);

  return (
    <div className={`library-annotation${inverse ? " library-annotation-inverse" : ""}`}>
      <span>Personal annotation</span>
      {hasAnnotation ? (
        <div>
          {personalNote ? <p>{personalNote}</p> : null}
          {ideaIKept ? <p><strong>Idea I kept:</strong> {ideaIKept}</p> : null}
        </div>
      ) : (
        <p>Awaiting Chuka&apos;s note.</p>
      )}
    </div>
  );
}
