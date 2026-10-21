import { startTrackMap, trackMap } from '../components/track-map.ts';
import { CIRCUITS, pitDelta } from '../simulation/circuits.ts';
import type { Stage } from './index.ts';

let selected = CIRCUITS[0]!.id;

function demo(): string {
  const circuit = CIRCUITS.find((c) => c.id === selected) ?? CIRCUITS[0]!;

  return `
<div class="demo narrow">
  <div class="choices" role="group" aria-label="Circuit">
    ${CIRCUITS.map(
      (c) => `
    <button type="button" class="choice" data-circuit="${c.id}" aria-pressed="${c.id === selected}">
      <span class="choice-label">${c.name}</span>
      <small>${pitDelta(c)} s delta</small>
    </button>`,
    ).join('')}
  </div>

  ${trackMap(circuit)}

  <div class="legend">
    <span class="key key-pit">Through the pit road</span>
    <span class="key key-racing">Staying on track</span>
  </div>

  <div class="delta">
    <p>
      <span class="op"></span>
      <span class="num pit-road">${circuit.pitSeconds} s</span>
      <span>through the pit road</span>
    </p>
    <p>
      <span class="op">&minus;</span>
      <span class="num racing">${circuit.trackSeconds} s</span>
      <span>at racing speed</span>
    </p>
    <p class="delta-total">
      <span class="op">=</span>
      <span class="num"><strong>${pitDelta(circuit)} s</strong></span>
      <span>lost by stopping</span>
    </p>
  </div>

  <p class="note">
    The pit lane at ${circuit.name} has its own length and its own speed limit, so the
    cost of a stop is a property of the circuit, not of the car. This is the P you were
    sliding a moment ago, in real seconds.
  </p>
</div>`;
}

export const pitDeltaStage: Stage = {
  id: 'pit-delta',
  title: 'What a stop actually costs',
  lede: `P is not the few seconds the car sits still. It is the pit delta: the time through
    the pit road minus the time to cover the same stretch of track at racing speed. Pick a
    circuit and watch both cars run from one marker to the other.`,
  render: demo,
  mount(body) {
    startTrackMap(body);

    body.addEventListener('click', (event) => {
      const choice = (event.target as HTMLElement).closest<HTMLButtonElement>(
        '.choice',
      );
      if (!choice) return;

      selected = choice.dataset.circuit!;
      body.innerHTML = demo();
      startTrackMap(body);
    });
  },
};
