import styles from "./PracticeBlueprint.module.css";

const signalPoints = [
  [62, 72, 4], [112, 118, 3], [174, 58, 5], [244, 91, 3], [331, 61, 4],
  [416, 99, 3], [508, 64, 5], [574, 130, 3], [73, 205, 3], [133, 278, 5],
  [526, 245, 4], [594, 310, 3], [482, 377, 5], [375, 411, 3], [258, 389, 4],
  [154, 413, 3], [61, 356, 4],
] as const;

const modules = [
  { key: "owner", label: "OWNER", x: 164, y: 136, portX: 266, portY: 172 },
  { key: "work", label: "WORK", x: 364, y: 136, portX: 364, portY: 172 },
  { key: "data", label: "DATA", x: 164, y: 270, portX: 266, portY: 306 },
  { key: "tools", label: "TOOLS", x: 364, y: 270, portX: 364, portY: 306 },
] as const;

export function PracticeBlueprint() {
  return (
    <figure
      className={styles.study}
      data-blueprint
      data-blueprint-active-state="improve"
      aria-labelledby="practice-blueprint-caption"
    >
      <svg
        className={styles.blueprint}
        viewBox="0 0 640 460"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="practice-blueprint-title practice-blueprint-description"
      >
        <title id="practice-blueprint-title">An operating system taking shape</title>
        <desc id="practice-blueprint-description">
          Ambiguous signals narrow to one constraint. Four incomplete modules become a connected system, then a feedback circuit reinforces and changes it.
        </desc>

        <g className={styles.grid} data-blueprint-part="field" aria-hidden="true">
          {[40, 120, 200, 280, 360, 440, 520, 600].map((x) => (
            <path d={`M${x} 28V432`} key={`x-${x}`} />
          ))}
          {[36, 100, 164, 228, 292, 356, 420].map((y) => (
            <path d={`M28 ${y}H612`} key={`y-${y}`} />
          ))}
          <path className={styles.majorAxis} d="M320 28V432M28 230H612" />
        </g>

        <g
          className={styles.observe}
          data-blueprint-layer="observe"
          data-blueprint-state="01"
          data-blueprint-role="context"
          aria-hidden="true"
        >
          <path data-blueprint-part="noise" d="M43 151C96 20 160 195 223 93S344 45 404 155 517 236 594 83" />
          <path data-blueprint-part="noise" d="M39 326C111 214 164 370 237 282S360 337 424 260 531 194 601 291" />
          <path data-blueprint-part="noise" d="M76 404C123 326 206 424 274 348S424 407 558 343" />
          {signalPoints.map(([cx, cy, r]) => (
            <circle data-blueprint-part="signal" cx={cx} cy={cy} r={r} key={`${cx}-${cy}`} />
          ))}
          <text className={styles.stateLabel} x="42" y="52">OBSERVE / AMBIGUOUS SIGNALS</text>
        </g>

        <g
          className={styles.define}
          data-blueprint-layer="define"
          data-blueprint-state="02"
          data-blueprint-role="focus"
          aria-hidden="true"
        >
          <path className={styles.focusRay} data-blueprint-part="constraint-ray" d="M82 90L244 182M558 83L396 182M75 374L244 278M565 368L396 278" />
          <rect data-blueprint-part="constraint" x="244" y="182" width="152" height="96" rx="4" />
          <path data-blueprint-part="constraint-mark" d="M244 204H228V182H250M390 182H412V204M396 256H412V278H390M250 278H228V256" />
          <circle data-blueprint-part="constraint-point" cx="320" cy="230" r="7" />
          <text className={styles.eyebrow} x="260" y="211">ISOLATED CONSTRAINT</text>
          <text className={styles.constraintLabel} x="320" y="241" textAnchor="middle">WHAT BLOCKS FLOW?</text>
        </g>

        <g
          className={styles.construct}
          data-blueprint-layer="construct"
          data-blueprint-state="03"
          data-blueprint-role="structure"
          aria-hidden="true"
        >
          {modules.map(({ key, label, x, y, portX, portY }) => (
            <g className={styles.module} data-blueprint-part="module" data-blueprint-module={key} key={key}>
              <path d={`M${x + 14} ${y}H${x + 116}V${y + 50}M${x + 102} ${y + 72}H${x}V${y + 22}`} />
              <path className={styles.moduleGap} d={`M${x} ${y + 22}V${y}H${x + 14}M${x + 116} ${y + 50}V${y + 72}H${x + 102}`} />
              <circle cx={portX} cy={portY} r="4" />
              <text x={x + 14} y={y + 29}>{label}</text>
              <text className={styles.moduleStatus} x={x + 14} y={y + 49}>MODULE / OPEN</text>
            </g>
          ))}
          <text className={styles.stateLabel} x="42" y="420">CONSTRUCT / CAPABILITIES TAKE FORM</text>
        </g>

        <g
          className={styles.organise}
          data-blueprint-layer="organise"
          data-blueprint-state="04"
          data-blueprint-role="connection"
          aria-hidden="true"
        >
          <rect className={styles.systemBoundary} data-blueprint-part="system-boundary" x="138" y="110" width="364" height="246" rx="10" />
          <path data-blueprint-part="connector" d="M266 172H320V212M364 172H320M266 306H320V248M364 306H320" />
          <path className={styles.crossLink} data-blueprint-part="connector" d="M266 172L364 306M364 172L266 306" />
          <circle className={styles.hubOuter} data-blueprint-part="hub" cx="320" cy="230" r="28" />
          <circle className={styles.hubInner} data-blueprint-part="hub-core" cx="320" cy="230" r="8" />
          <text className={styles.hubLabel} x="320" y="234" textAnchor="middle">SYSTEM</text>
          <text className={styles.boundaryLabel} x="153" y="128">CONNECTED OPERATING MODEL</text>
        </g>

        <g
          className={styles.improve}
          data-blueprint-layer="improve"
          data-blueprint-state="05"
          data-blueprint-role="feedback"
          aria-hidden="true"
        >
          <path
            className={styles.feedbackLoop}
            data-blueprint-part="feedback-loop"
            data-blueprint-loop
            d="M489 92C574 130 605 226 573 309 543 387 448 424 367 399 322 385 285 365 251 338"
          />
          <path className={styles.feedbackArrow} data-blueprint-part="feedback-arrow" d="M251 338L273 337M251 338L263 357" />
          <path className={styles.reinforcement} data-blueprint-part="reinforcement" d="M320 202V172H364M292 230H266M320 258V306H364" />
          <circle className={styles.feedbackNode} data-blueprint-part="feedback-node" cx="489" cy="92" r="7" />
          <circle className={styles.feedbackNode} data-blueprint-part="feedback-node" cx="573" cy="309" r="7" />
          <circle className={styles.feedbackNode} data-blueprint-part="feedback-node" cx="367" cy="399" r="7" />
          <text className={styles.feedbackLabel} x="466" y="391">MEASURE</text>
          <text className={styles.feedbackLabel} x="528" y="334">LEARN</text>
          <text className={styles.feedbackLabel} x="506" y="111">ADAPT</text>
        </g>
      </svg>

      <figcaption id="practice-blueprint-caption" className={styles.caption}>
        <span>Ambiguous signals</span>
        <span className={styles.captionLine} aria-hidden="true" />
        <span>Reinforced system</span>
      </figcaption>
    </figure>
  );
}
