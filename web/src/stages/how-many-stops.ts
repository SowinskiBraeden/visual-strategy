import { timeBlocks } from '../components/time-blocks.ts';
import { pitChips, totalBar } from '../components/total-bar.ts';
import {
  TYRES,
  expandStints,
  pitLaps,
  stintBlocks,
  totalBlocks,
  type Stint,
} from '../simulation/tyres.ts';
import type { Stage } from './index.ts';

const RACE_LAPS = 20;

interface Plan {
  name: string;
  /** Imperative form, for the rules and the verdict. */
  call: string;
  stints: Stint[];
}

const ONE: Plan = {
  name: 'One stop',
  call: 'Stop once',
  stints: [
    { compound: 'soft', laps: 8 },
    { compound: 'medium', laps: 12 },
  ],
};

const TWO: Plan = {
  name: 'Two stops',
  call: 'Stop twice',
  stints: [
    { compound: 'soft', laps: 8 },
    { compound: 'soft', laps: 8 },
    { compound: 'medium', laps: 4 },
  ],
};

const stops = (plan: Plan) => plan.stints.length - 1;
const onTrack = (plan: Plan) => totalBlocks(plan.stints);
const raceTime = (plan: Plan, cost: number) => onTrack(plan) + stops(plan) * cost;

/** Where the plans cost the same: the blocks saved buy exactly one more stop. */
const breakEven = (onTrack(ONE) - onTrack(TWO)) / (stops(TWO) - stops(ONE));

let pitCost = 5;

function chart(plan: Plan): string {
  return `
<div class="strategy">
  <p class="strategy-head">
    <span class="strategy-name">${plan.name}</span>
    <span class="strategy-sum"><b>${onTrack(plan)}</b> on track + ${pitChips(stops(plan))}</span>
  </p>
  ${timeBlocks({
    laps: expandStints(plan.stints),
    totalLaps: RACE_LAPS,
    maxBlocks: TYRES.medium.blocksPerLap,
    pitAfterLaps: pitLaps(plan.stints),
    blockSize: 20,
  })}
</div>`;
}

/** The same two totals from the charts, worked down to a value for P. */
function solve(): string {
  const gap = onTrack(ONE) - onTrack(TWO);

  return `
<div class="solve">
  <p class="solve-row heads">
    <span class="side">${ONE.name}</span>
    <span class="eq"></span>
    <span class="side">${TWO.name}</span>
    <span class="hint"></span>
  </p>
  <p class="solve-row">
    <span class="side"><b>${onTrack(ONE)}</b> + ${pitChips(1)}</span>
    <span class="eq">=</span>
    <span class="side"><b>${onTrack(TWO)}</b> + ${pitChips(2)}</span>
    <span class="hint">both race times, in time blocks</span>
  </p>
  <p class="solve-row">
    <span class="side"><b>${onTrack(ONE)}</b></span>
    <span class="eq">=</span>
    <span class="side"><b>${onTrack(TWO)}</b> + ${pitChips(1)}</span>
    <span class="hint">take one stop off each side</span>
  </p>
  <p class="solve-row solved">
    <span class="side"><b>${gap}</b></span>
    <span class="eq">=</span>
    <span class="side">${pitChips(1)}</span>
    <span class="hint">the stop is worth ${gap} time blocks</span>
  </p>
</div>`;
}

function bar(plan: Plan, rival: Plan): string {
  return totalBar({
    label: plan.name,
    segments: [
      ...plan.stints.map((stint) => ({
        compound: stint.compound,
        blocks: stintBlocks(stint),
      })),
      ...Array.from({ length: stops(plan) }, () => ({
        compound: 'pit' as const,
        blocks: pitCost,
      })),
    ],
    best: raceTime(plan, pitCost) < raceTime(rival, pitCost),
  });
}

function verdict(): string {
  const one = raceTime(ONE, pitCost);
  const two = raceTime(TWO, pitCost);

  if (one === two) {
    return `
<p class="verdict level">
  <span class="verdict-at">P = ${pitCost}</span>
  <span>Dead level. Both plans finish in ${one} time blocks.</span>
</p>`;
  }

  const winner = one < two ? ONE : TWO;
  const margin = Math.abs(one - two);

  return `
<p class="verdict">
  <span class="verdict-at">P = ${pitCost}</span>
  <span><strong>${winner.call}</strong>, quicker by ${margin} time block${margin === 1 ? '' : 's'}.</span>
</p>`;
}

function summary(): string {
  return `
${bar(ONE, TWO)}
${bar(TWO, ONE)}

<ul class="rules">
  <li class="${pitCost > breakEven ? 'on' : ''}">
    ${pitChips(1)} longer than ${breakEven}: <strong>${ONE.call.toLowerCase()}</strong>
  </li>
  <li class="${pitCost < breakEven ? 'on' : ''}">
    ${pitChips(1)} shorter than ${breakEven}: <strong>${TWO.call.toLowerCase()}</strong>
  </li>
</ul>

${verdict()}`;
}

function demo(): string {
  return `
<div class="demo">
  ${chart(ONE)}
  ${chart(TWO)}
  ${solve()}

  <label class="slider plain">
    <span class="slider-label">A pit stop costs <strong>${pitCost}</strong> time blocks</span>
    <input type="range" name="cost" min="1" max="16" value="${pitCost}" />
  </label>

  <div class="demo-sum">${summary()}</div>
</div>`;
}

export const howManyStops: Stage = {
  id: 'how-many-stops',
  title: 'How many stops?',
  lede: `Tyres wear out, so the last stage's trick is off the table: a set of softs is good
    for ${TYRES.soft.maxLaps} laps here, mediums for ${TYRES.medium.maxLaps}. Over
    ${RACE_LAPS} laps that leaves a real choice, and the winner depends entirely on what a
    stop costs you.`,
  render: demo,
  mount(body) {
    body.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.name !== 'cost') return;

      pitCost = Number(input.value);
      body.querySelector('.demo-sum')!.innerHTML = summary();
      body.querySelector('.slider-label strong')!.textContent = String(pitCost);
    });
  },
};
