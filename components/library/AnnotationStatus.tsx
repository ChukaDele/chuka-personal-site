type AnnotationStatusProps = {
  personalNote: string | null;
  ideaIKept?: string | null;
  inverse?: boolean;
};

export function AnnotationStatus({ personalNote, ideaIKept, inverse = false }: AnnotationStatusProps) {
  const hasAnnotation = Boolean(personalNote || ideaIKept);

  if (!hasAnnotation) return null;

  return (
    <div className={`library-annotation${inverse ? " library-annotation-inverse" : ""}`}>
      <span>Personal annotation</span>
      <div>
        {personalNote ? <p>{personalNote}</p> : null}
        {ideaIKept ? <p><strong>Idea I kept:</strong> {ideaIKept}</p> : null}
      </div>
    </div>
  );
}
