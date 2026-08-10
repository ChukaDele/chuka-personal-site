import styles from "./PracticeBlueprint.module.css";

type Point = Readonly<{ x: number; y: number }>;
type Rect = Readonly<{ x: number; y: number; width: number; height: number }>;
type ModuleKey = "owner" | "work" | "data" | "tools";
type Presentation = "wide" | "compact";

type ModuleDefinition = Readonly<{
  key: ModuleKey;
  label: string;
  column: -1 | 1;
  row: -1 | 1;
}>;

type ModuleGeometry = ModuleDefinition & Readonly<{
  box: Rect;
  center: Point;
  port: Point;
}>;

type BlueprintGeometry = Readonly<{
  presentation: Presentation;
  boundary: Rect;
  constraint: Rect;
  hub: Point;
  hubRadius: number;
  modules: readonly ModuleGeometry[];
  feedback: Readonly<{
    start: Point;
    turn: Point;
    measure: Point;
    end: Point;
  }>;
}>;

const VIEWBOX = Object.freeze({ width: 640, height: 460, safeArea: 28 });

const BLUEPRINT = Object.freeze({
  modules: [
    { key: "owner", label: "OWNER", column: -1, row: -1 },
    { key: "work", label: "WORK", column: 1, row: -1 },
    { key: "data", label: "DATA", column: -1, row: 1 },
    { key: "tools", label: "TOOLS", column: 1, row: 1 },
  ] satisfies readonly ModuleDefinition[],
  signalPattern: [
    [.06, .12, 4], [.15, .23, 3], [.25, .08, 5], [.37, .16, 3], [.52, .09, 4],
    [.66, .18, 3], [.82, .1, 5], [.93, .27, 3], [.08, .47, 3], [.18, .66, 5],
    [.85, .58, 4], [.96, .76, 3], [.77, .93, 5], [.59, 1, 3], [.39, .94, 4],
    [.22, 1, 3], [.06, .88, 4],
  ] as const,
});

const point = (x: number, y: number): Point => ({ x, y });
const right = (rect: Rect) => rect.x + rect.width;
const bottom = (rect: Rect) => rect.y + rect.height;
const centerOf = (rect: Rect): Point => point(rect.x + rect.width / 2, rect.y + rect.height / 2);
const fmt = (value: number) => Number(value.toFixed(2));

function portFacingHub(box: Rect, hub: Point): Point {
  const center = centerOf(box);
  const dx = hub.x - center.x;
  const dy = hub.y - center.y;
  const horizontalIntersection = Math.abs(dx) / box.width >= Math.abs(dy) / box.height;

  if (horizontalIntersection) {
    return point(dx >= 0 ? right(box) : box.x, center.y);
  }

  return point(center.x, dy >= 0 ? bottom(box) : box.y);
}

function makeModule(definition: ModuleDefinition, box: Rect, hub: Point): ModuleGeometry {
  return { ...definition, box, center: centerOf(box), port: portFacingHub(box, hub) };
}

function makeWideGeometry(): BlueprintGeometry {
  const boundary: Rect = { x: 138, y: 110, width: 364, height: 246 };
  const hub = centerOf(boundary);
  const moduleSize = { width: 116, height: 72 };
  const moduleOffset = { x: 98, y: 67 };
  const modules = BLUEPRINT.modules.map((definition) => {
    const center = point(
      hub.x + definition.column * moduleOffset.x,
      hub.y + definition.row * moduleOffset.y,
    );
    const box = {
      x: center.x - moduleSize.width / 2,
      y: center.y - moduleSize.height / 2,
      ...moduleSize,
    };
    return makeModule(definition, box, hub);
  });
  const constraint = { x: hub.x - 76, y: hub.y - 48, width: 152, height: 96 };

  return {
    presentation: "wide",
    boundary,
    constraint,
    hub,
    hubRadius: 28,
    modules,
    feedback: {
      start: point(right(boundary) - 13, boundary.y - 18),
      turn: point(VIEWBOX.width - 67, bottom(boundary) - 47),
      measure: point(hub.x + 47, VIEWBOX.height - 61),
      end: modules.find(({ key }) => key === "data")!.port,
    },
  };
}

function makeCompactGeometry(): BlueprintGeometry {
  const boundary: Rect = { x: 118, y: 120, width: 450, height: 264 };
  const hub = point(right(boundary) - 42, centerOf(boundary).y);
  const moduleSize = { width: 330, height: 50 };
  const stackTop = boundary.y + 10;
  const stackGap = 14;
  const modules = BLUEPRINT.modules.map((definition, index) => {
    const box = {
      x: boundary.x + 18,
      y: stackTop + index * (moduleSize.height + stackGap),
      ...moduleSize,
    };
    return makeModule(definition, box, hub);
  });
  const constraint = { x: boundary.x + 18, y: 42, width: 330, height: 60 };

  return {
    presentation: "compact",
    boundary,
    constraint,
    hub,
    hubRadius: 24,
    modules,
    feedback: {
      start: point(right(boundary) - 22, boundary.y - 18),
      turn: point(right(boundary) + 32, centerOf(boundary).y + 65),
      measure: point(hub.x - 42, bottom(boundary) + 28),
      end: modules.at(-1)!.port,
    },
  };
}

const GEOMETRIES = [makeWideGeometry(), makeCompactGeometry()] as const;

function moduleOutline(box: Rect) {
  const notch = 14;
  return [
    `M${fmt(box.x + notch)} ${fmt(box.y)}`,
    `H${fmt(right(box))}V${fmt(bottom(box) - 22)}`,
    `M${fmt(right(box) - notch)} ${fmt(bottom(box))}`,
    `H${fmt(box.x)}V${fmt(box.y + 22)}`,
  ].join("");
}

function moduleGap(box: Rect) {
  const notch = 14;
  return [
    `M${fmt(box.x)} ${fmt(box.y + 22)}V${fmt(box.y)}H${fmt(box.x + notch)}`,
    `M${fmt(right(box))} ${fmt(bottom(box) - 22)}V${fmt(bottom(box))}H${fmt(right(box) - notch)}`,
  ].join("");
}

function hubAnchor(port: Point, hub: Point, radius: number): Point {
  const dx = port.x - hub.x;
  const dy = port.y - hub.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  return point(hub.x + (dx / magnitude) * radius, hub.y + (dy / magnitude) * radius);
}

function connectorPath(module: ModuleGeometry, geometry: BlueprintGeometry) {
  const target = hubAnchor(module.port, geometry.hub, geometry.hubRadius);
  const elbowX = (module.port.x + target.x) / 2;
  return `M${fmt(module.port.x)} ${fmt(module.port.y)}H${fmt(elbowX)}V${fmt(target.y)}H${fmt(target.x)}`;
}

function feedbackPath({ start, turn, measure, end }: BlueprintGeometry["feedback"]) {
  return [
    `M${fmt(start.x)} ${fmt(start.y)}`,
    `C${fmt(turn.x)} ${fmt(start.y + 38)} ${fmt(turn.x)} ${fmt(turn.y - 34)} ${fmt(turn.x)} ${fmt(turn.y)}`,
    `C${fmt(turn.x)} ${fmt(measure.y)} ${fmt(measure.x + 45)} ${fmt(measure.y)} ${fmt(measure.x)} ${fmt(measure.y)}`,
    `C${fmt(measure.x - 42)} ${fmt(measure.y)} ${fmt(end.x + 44)} ${fmt(end.y + 22)} ${fmt(end.x)} ${fmt(end.y)}`,
  ].join("");
}

function focusRays(constraint: Rect) {
  const inset = 54;
  return [
    `M${VIEWBOX.safeArea + inset} ${VIEWBOX.safeArea + 62}L${constraint.x} ${constraint.y}`,
    `M${VIEWBOX.width - VIEWBOX.safeArea - inset} ${VIEWBOX.safeArea + 55}L${right(constraint)} ${constraint.y}`,
    `M${VIEWBOX.safeArea + inset} ${VIEWBOX.height - VIEWBOX.safeArea - 58}L${constraint.x} ${bottom(constraint)}`,
    `M${VIEWBOX.width - VIEWBOX.safeArea - inset} ${VIEWBOX.height - VIEWBOX.safeArea - 64}L${right(constraint)} ${bottom(constraint)}`,
  ].join("");
}

function constraintMarks(constraint: Rect) {
  const arm = 16;
  const inset = 6;
  return [
    `M${constraint.x} ${constraint.y + 22}H${constraint.x - arm}V${constraint.y}H${constraint.x + inset}`,
    `M${right(constraint) - inset} ${constraint.y}H${right(constraint) + arm}V${constraint.y + 22}`,
    `M${right(constraint)} ${bottom(constraint) - 22}H${right(constraint) + arm}V${bottom(constraint)}H${right(constraint) - inset}`,
    `M${constraint.x + inset} ${bottom(constraint)}H${constraint.x - arm}V${bottom(constraint) - 22}`,
  ].join("");
}

function BlueprintRenderer({ geometry }: { geometry: BlueprintGeometry }) {
  const { presentation, boundary, constraint, hub, hubRadius, modules, feedback } = geometry;
  const compact = presentation === "compact";
  const constraintCenter = centerOf(constraint);
  const arrowSize = compact ? 14 : 12;

  return (
    <g className={styles.renderer} data-blueprint-renderer={presentation}>
      <g
        className={styles.observe}
        data-blueprint-layer="observe"
        data-blueprint-state="01"
        data-blueprint-role="context"
        aria-hidden="true"
      >
        <path data-blueprint-part="noise" d={compact ? "M42 82C124 18 204 126 288 70S436 32 598 88" : "M43 151C96 20 160 195 223 93S344 45 404 155 517 236 594 83"} />
        <path data-blueprint-part="noise" d={compact ? "M42 406C132 354 230 438 330 392S500 348 598 406" : "M39 326C111 214 164 370 237 282S360 337 424 260 531 194 601 291"} />
        {!compact && <path data-blueprint-part="noise" d="M76 404C123 326 206 424 274 348S424 407 558 343" />}
        {BLUEPRINT.signalPattern.map(([x, y, radius]) => (
          <circle
            data-blueprint-part="signal"
            cx={fmt(VIEWBOX.safeArea + x * (VIEWBOX.width - VIEWBOX.safeArea * 2))}
            cy={fmt(VIEWBOX.safeArea + y * (VIEWBOX.height - VIEWBOX.safeArea * 2))}
            r={radius}
            key={`${presentation}-${x}-${y}`}
          />
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
        <path className={styles.focusRay} data-blueprint-part="constraint-ray" d={focusRays(constraint)} />
        <rect data-blueprint-part="constraint" {...constraint} rx="4" />
        <path data-blueprint-part="constraint-mark" d={constraintMarks(constraint)} />
        <circle data-blueprint-part="constraint-point" cx={constraintCenter.x} cy={constraintCenter.y} r={compact ? 6 : 7} />
        <text className={styles.eyebrow} x={constraint.x + 16} y={constraint.y + (compact ? 22 : 29)}>ISOLATED CONSTRAINT</text>
        <text className={styles.constraintLabel} x={constraintCenter.x} y={constraintCenter.y + (compact ? 19 : 11)} textAnchor="middle">WHAT BLOCKS FLOW?</text>
      </g>

      <g
        className={styles.construct}
        data-blueprint-layer="construct"
        data-blueprint-state="03"
        data-blueprint-role="structure"
        aria-hidden="true"
      >
        {modules.map(({ key, label, box, port }) => (
          <g className={styles.module} data-blueprint-part="module" data-blueprint-module={key} key={`${presentation}-${key}`}>
            <path d={moduleOutline(box)} />
            <path className={styles.moduleGap} d={moduleGap(box)} />
            <circle data-blueprint-part="module-port" cx={port.x} cy={port.y} r={compact ? 5 : 4} />
            <text className={styles.moduleLabel} x={box.x + 14} y={centerOf(box).y + (compact ? 6 : -7)}>{label}</text>
            {!compact && <text className={styles.moduleStatus} x={box.x + 14} y={centerOf(box).y + 13}>MODULE / OPEN</text>}
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
        <rect className={styles.systemBoundary} data-blueprint-part="system-boundary" {...boundary} rx="10" />
        {modules.map((module) => (
          <path data-blueprint-part="connector" d={connectorPath(module, geometry)} key={`${presentation}-${module.key}-connector`} />
        ))}
        {!compact && (
          <path
            className={styles.crossLink}
            data-blueprint-part="connector"
            d={`M${modules[0].port.x} ${modules[0].port.y}L${modules[3].port.x} ${modules[3].port.y}M${modules[1].port.x} ${modules[1].port.y}L${modules[2].port.x} ${modules[2].port.y}`}
          />
        )}
        <circle className={styles.hubOuter} data-blueprint-part="hub" cx={hub.x} cy={hub.y} r={hubRadius} />
        <circle className={styles.hubInner} data-blueprint-part="hub-core" cx={hub.x} cy={hub.y} r={compact ? 7 : 8} />
        <text className={styles.hubLabel} x={hub.x} y={hub.y + (compact ? 38 : 4)} textAnchor="middle">SYSTEM</text>
        <text className={styles.boundaryLabel} x={boundary.x + 15} y={boundary.y + (compact ? -8 : 18)}>CONNECTED OPERATING MODEL</text>
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
          d={feedbackPath(feedback)}
          pathLength="1"
        />
        <path
          className={styles.feedbackArrow}
          data-blueprint-part="feedback-arrow"
          d={`M${feedback.end.x} ${feedback.end.y}L${feedback.end.x + arrowSize} ${feedback.end.y - arrowSize / 2}M${feedback.end.x} ${feedback.end.y}L${feedback.end.x + arrowSize} ${feedback.end.y + arrowSize / 2}`}
        />
        {modules.map((module) => (
          <path
            className={styles.reinforcement}
            data-blueprint-part="reinforcement"
            d={`M${hub.x} ${hub.y}L${module.port.x} ${module.port.y}`}
            key={`${presentation}-${module.key}-reinforcement`}
          />
        ))}
        {[feedback.start, feedback.turn, feedback.measure].map((node, index) => (
          <circle className={styles.feedbackNode} data-blueprint-part="feedback-node" cx={node.x} cy={node.y} r={compact ? 6 : 7} key={`${presentation}-feedback-${index}`} />
        ))}
        <text className={styles.feedbackLabel} x={feedback.measure.x + 10} y={feedback.measure.y - 10}>MEASURE</text>
        <text className={styles.feedbackLabel} x={feedback.turn.x - 45} y={feedback.turn.y + 25}>LEARN</text>
        <text className={styles.feedbackLabel} x={feedback.start.x + 14} y={feedback.start.y + 19}>ADAPT</text>
      </g>
    </g>
  );
}

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
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="practice-blueprint-title practice-blueprint-description"
      >
        <title id="practice-blueprint-title">An operating system taking shape</title>
        <desc id="practice-blueprint-description">
          Ambiguous signals narrow to one constraint. Four incomplete modules become a connected system, then a feedback circuit reinforces and changes it.
        </desc>

        <g className={styles.grid} data-blueprint-part="field" aria-hidden="true">
          {[40, 120, 200, 280, 360, 440, 520, 600].map((x) => <path d={`M${x} 28V432`} key={`x-${x}`} />)}
          {[36, 100, 164, 228, 292, 356, 420].map((y) => <path d={`M28 ${y}H612`} key={`y-${y}`} />)}
          <path className={styles.majorAxis} d="M320 28V432M28 230H612" />
        </g>

        {GEOMETRIES.map((geometry) => <BlueprintRenderer geometry={geometry} key={geometry.presentation} />)}
      </svg>

      <figcaption id="practice-blueprint-caption" className={styles.caption}>
        <span>Ambiguous signals</span>
        <span className={styles.captionLine} aria-hidden="true" />
        <span>Reinforced system</span>
      </figcaption>
    </figure>
  );
}
