import type { Circuit } from '../simulation/circuits.ts';

/** Animation seconds per second of race time, plus a pause before the replay. */
const PACE = 0.09;
const HOLD = 0.9;

function runner(kind: 'pit' | 'racing', seconds: number, cycle: number): string {
  const arrives = Number(((seconds * PACE) / cycle).toFixed(3));

  return `<circle class="runner runner-${kind}" r="7"
      data-path="${kind}-path" data-arrives="${arrives}" data-cycle="${cycle * 1000}" />`;
}

function marker(
  [x, y]: [number, number],
  label: string,
  anchor: 'start' | 'end',
  below: boolean,
): string {
  const dx = anchor === 'start' ? 14 : -14;

  return `
    <g class="marker">
      <circle class="node" cx="${x}" cy="${y}" r="11" />
      <text x="${x + dx}" y="${y + (below ? 24 : -17)}" text-anchor="${anchor}">${label}</text>
    </g>`;
}

/**
 * Starts the two cars. SMIL will not reliably begin for an SVG that was dropped
 * in with innerHTML, so the motion runs on the Web Animations API instead: each
 * car follows its own path and holds at the end until the cycle restarts, which
 * keeps the pair in step however different their times are.
 */
export function startTrackMap(root: ParentNode): void {
  root.querySelectorAll<SVGCircleElement>('.runner').forEach((car) => {
    const path = root.querySelector(`#${car.dataset.path}`)?.getAttribute('d');
    if (!path) return;

    car.style.offsetPath = `path("${path}")`;
    car.style.offsetRotate = '0deg';

    car.animate(
      [
        { offsetDistance: '0%', offset: 0 },
        { offsetDistance: '100%', offset: Number(car.dataset.arrives) },
        { offsetDistance: '100%', offset: 1 },
      ],
      { duration: Number(car.dataset.cycle), iterations: Infinity },
    );
  });
}

export function trackMap(circuit: Circuit): string {
  const slowest = Math.max(circuit.pitSeconds, circuit.trackSeconds);
  const cycle = Number((slowest * PACE + HOLD).toFixed(2));
  const [ax, ay, angle] = circuit.arrow;

  // Each circuit keeps its own aspect, scaled to fit the same box.
  const [, , vw, vh] = circuit.view.split(' ').map(Number) as number[];
  const scale = Math.min(620 / vw!, 340 / vh!);

  return `
<figure class="track">
  <svg width="${Math.round(vw! * scale)}" height="${Math.round(vh! * scale)}"
    viewBox="${circuit.view}" role="img"
    aria-label="Schematic of the pit lane and the racing line at ${circuit.name}">
    <path class="ribbon context" d="${circuit.before}" />
    <path class="ribbon context" d="${circuit.after}" />
    <path class="ribbon" d="${circuit.racing}" />
    <path id="pit-path" class="path-pit" d="${circuit.pit}" />
    <path id="racing-path" class="path-racing" d="${circuit.racing}" />

    <g class="arrow" transform="translate(${ax} ${ay}) rotate(${angle})">
      <path d="M -9 -6 L 5 0 L -9 6 Z" />
    </g>

    ${circuit.marks
      .map(
        (m) =>
          `<text class="mark" x="${m.x}" y="${m.y}" text-anchor="${m.anchor ?? 'middle'}">${m.text}</text>`,
      )
      .join('\n    ')}

    ${marker(circuit.entry, 'PIT ENTRY', circuit.entryAnchor ?? 'start', circuit.labelsBelow ?? false)}
    ${marker(circuit.exit, 'REJOIN', circuit.exitAnchor ?? 'end', circuit.labelsBelow ?? false)}

    ${runner('pit', circuit.pitSeconds, cycle)}
    ${runner('racing', circuit.trackSeconds, cycle)}
  </svg>
  <figcaption>
    Schematic, drawn in the racing direction. Both cars leave the pit entry
    together and are timed to the point where the pit lane rejoins.
  </figcaption>
</figure>`;
}
