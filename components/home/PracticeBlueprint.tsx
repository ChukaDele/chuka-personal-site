import styles from "./PracticeBlueprint.module.css";

const observations = [
  [62, 88], [104, 56], [151, 104], [204, 67], [260, 112], [328, 70],
  [389, 105], [92, 164], [181, 153], [295, 166], [380, 181], [54, 225],
];

export function PracticeBlueprint() {
  return (
    <figure className={styles.study} aria-label="An operating blueprint progressing from observations to a feedback loop">
      <svg viewBox="0 0 460 390" role="img" aria-labelledby="practice-blueprint-title practice-blueprint-description">
        <title id="practice-blueprint-title">From observation to operating system</title>
        <desc id="practice-blueprint-description">
          Noisy observations narrow into a selected constraint, become components, connect into an operating system, and close with a feedback loop.
        </desc>

        <g className={styles.grid} aria-hidden="true">
          {[70, 140, 210, 280, 350, 420].map((x) => <path d={`M${x} 24V352`} key={`x-${x}`} />)}
          {[50, 110, 170, 230, 290, 350].map((y) => <path d={`M32 ${y}H432`} key={`y-${y}`} />)}
        </g>

        <g data-blueprint-layer="observe" className={styles.observe}>
          <path d="M48 124C92 17 134 201 190 94S294 43 337 136 397 238 421 78" />
          <path d="M39 245C92 193 119 291 177 214S281 269 330 207 385 177 424 240" />
          {observations.map(([cx, cy], index) => <circle cx={cx} cy={cy} r={index % 3 === 0 ? 5 : 3} key={`${cx}-${cy}`} />)}
        </g>

        <g data-blueprint-layer="define" className={styles.define}>
          <path d="M102 119H358V283H102Z" />
          <path d="M90 119H70M102 107V87M370 283H390M358 295V315" />
          <circle cx="230" cy="201" r="91" />
          <text x="116" y="143">SELECTED CONSTRAINT</text>
        </g>

        <g data-blueprint-layer="construct" className={styles.construct}>
          <rect x="133" y="158" width="74" height="42" rx="2" />
          <rect x="253" y="158" width="74" height="42" rx="2" />
          <rect x="133" y="224" width="74" height="42" rx="2" />
          <rect x="253" y="224" width="74" height="42" rx="2" />
          <text x="147" y="184">OWNER</text>
          <text x="267" y="184">WORK</text>
          <text x="147" y="250">DATA</text>
          <text x="267" y="250">TOOLS</text>
        </g>

        <g data-blueprint-layer="organise" className={styles.organise}>
          <path d="M207 179H253M290 200V224M253 245H207M170 224V200" />
          <path d="M207 179L253 245M253 179L207 245" />
          <circle cx="230" cy="212" r="9" />
          <text x="198" y="216">SYSTEM</text>
        </g>

        <g data-blueprint-layer="improve" className={styles.improve}>
          <path data-blueprint-loop d="M348 127C405 155 417 241 371 290 333 331 270 337 223 313" />
          <path d="M224 313L242 303M224 313L238 327" />
          <text x="304" y="329">FEEDBACK</text>
        </g>
      </svg>
      <figcaption><span>Ambiguous signals</span><span>Resolved operating loop</span></figcaption>
    </figure>
  );
}
