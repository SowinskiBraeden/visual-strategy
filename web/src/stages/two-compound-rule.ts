import { plotMarkup, timeBlocks } from '../components/time-blocks.ts';
import { totalBar } from '../components/total-bar.ts';
import {
  TYRES,
  expandStints,
  stintBlocks,
  totalBlocks,
  type Stint,
} from '../simulation/tyres.ts';
import type { Stage } from './index.ts';

const LAPS = 20;
const FIRST: Stint['compound'] = 'soft';
const SECOND: Stint['compound'] = 'medium';

let pitAfter = 5;

function strategy(pitLap: number): Stint[] {
  return [
    { compound: FIRST, laps: pitLap },
    { compound: SECOND, laps: LAPS - pitLap },
  ];
}

/** Quickest split available, ignoring the fixed pit loss. */
const fastest = Math.min(
  ...Array.from({ length: LAPS - 1 }, (_, i) => totalBlocks(strategy(i + 1))),
);

function plot(): string {
  return plotMarkup({
    laps: expandStints(strategy(pitAfter)),
    totalLaps: LAPS,
    pitAfterLaps: [pitAfter],
  });
}

/** Sits in the chart grid under the axis, so a lap number is a thumb position. */
function slider(): string {
  return `
<label class="slider" style="--from: 1; --to: ${LAPS - 1}">
  <span class="slider-label">Pit after lap <strong>${pitAfter}</strong></span>
  <input type="range" name="pit" min="1" max="${LAPS - 1}" value="${pitAfter}" />
</label>`;
}

function summary(): string {
  const stints = strategy(pitAfter);
  const best = totalBlocks(stints) === fastest;

  return `
${totalBar({
  segments: stints.map((stint) => ({
    compound: stint.compound,
    blocks: stintBlocks(stint),
  })),
  pitStops: 1,
  best,
})}
<p class="note${best ? ' on' : ''}">
  ${
    best
      ? `Quickest split there is: ${fastest} blocks + P. Stay on the softs for as long as the rule allows.`
      : `Keep moving the stop. One split gets this down to ${fastest} blocks + P.`
  }
</p>`;
}

function demo(): string {
  return `
<div class="demo">
  ${timeBlocks({
    laps: expandStints(strategy(pitAfter)),
    totalLaps: LAPS,
    maxBlocks: TYRES[SECOND].blocksPerLap,
    pitAfterLaps: [pitAfter],
    blockSize: 30,
    control: slider(),
  })}
  <div class="demo-sum">${summary()}</div>
</div>`;
}

export const twoCompoundRule: Stage = {
  id: 'two-compound-rule',
  title: 'You must use two compounds',
  lede: `A dry Grand Prix forces every car onto at least two different compounds, so a pit
    stop is never optional, and it costs you the time of a pitstop, P. Move the stop and find the cheapest way to
    obey the rule over ${LAPS} laps.`,
  render: demo,
  mount(body) {
    // Only the plot and the summary are redrawn, so dragging the slider is never
    // interrupted by its own element being replaced.
    body.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.name !== 'pit') return;

      pitAfter = Number(input.value);
      body.querySelector('.plot')!.innerHTML = plot();
      body.querySelector('.demo-sum')!.innerHTML = summary();
      body.querySelector('.slider-label strong')!.textContent = String(pitAfter);
    });
  },
};
