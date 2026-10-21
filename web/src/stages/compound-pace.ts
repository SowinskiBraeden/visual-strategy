import { timeBlocks } from '../components/time-blocks.ts';
import { totalBar } from '../components/total-bar.ts';
import {
  COMPOUNDS,
  TYRES,
  expandStints,
  stintBlocks,
  type Compound,
} from '../simulation/tyres.ts';
import type { Stage } from './index.ts';

const LAPS = 20;

let selected: Compound = 'soft';

function picker(): string {
  return COMPOUNDS.map(
    (compound) => `
    <button type="button" class="choice" data-compound="${compound}" aria-pressed="${compound === selected}">
      <span class="swatch"></span>
      <span class="choice-label">${TYRES[compound].label}</span>
      <small>${TYRES[compound].blocksPerLap} blocks / lap</small>
    </button>`,
  ).join('');
}

function demo(): string {
  const stint = { compound: selected, laps: LAPS };

  return `
<div class="demo">
  <div class="choices" role="group" aria-label="Tyre compound">${picker()}</div>
  ${timeBlocks({
    laps: expandStints([stint]),
    totalLaps: LAPS,
    maxBlocks: TYRES.hard.blocksPerLap,
    blockSize: 22,
  })}
  ${totalBar({
    label: `${LAPS} laps`,
    segments: [{ compound: selected, blocks: stintBlocks(stint) }],
    best: selected === 'soft',
  })}
</div>`;
}

export const compoundPace: Stage = {
  id: 'compound-pace',
  title: 'Softer tyres cost less time',
  lede: `Ignore the seconds, imagine each tyre costs some number of units of time per lap, and the
    compound can change the units of time. Consider a ${LAPS} lap race, select a compound and watch units of time add up.`,
  render: demo,
  mount(body) {
    body.addEventListener('click', (event) => {
      const choice = (event.target as HTMLElement).closest<HTMLButtonElement>(
        '.choice',
      );
      if (!choice) return;

      selected = choice.dataset.compound as Compound;
      body.innerHTML = demo();
    });
  },
};
