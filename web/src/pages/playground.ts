import { compare_strategies } from 'visual-strategy';
import { loadSimulation } from '../simulation/wasm.ts';

const compounds = ['Soft', 'Medium', 'Hard'] as const;

function tyreSelect(id: string, selected: number): string {
  return `<select id="${id}">${compounds.map((name, value) =>
    `<option value="${value}"${value === selected ? ' selected' : ''}>${name}</option>`,
  ).join('')}</select>`;
}

export function playground(): string {
  return `
<main class="page playground">
  <p class="eyebrow">50-lap race</p>
  <h1>Strategy builder</h1>
  <p class="lede">Choose the tyres and the laps to stop on. Every strategy automatically covers all 50 laps.</p>

  <section class="playground-control" aria-labelledby="pit-delta-label">
    <div>
      <label id="pit-delta-label" for="pit-delta">Pit loss</label>
      <p>Time lost each time the car enters the pits.</p>
    </div>
    <output id="pit-delta-output" for="pit-delta">20.0 s</output>
    <input id="pit-delta" type="range" min="10" max="30" step="0.5" value="20" />
  </section>

  <div class="strategy-builders">
    <section class="strategy-builder">
      <div class="preset-title"><h2>One stop</h2><span>2 stints</span></div>
      <div class="stint-row"><span>Start</span>${tyreSelect('one-first', 1)}<span id="one-first-laps">25 laps</span></div>
      <label class="stop-control" for="one-stop"><span>Pit after lap</span><output id="one-stop-output">25</output></label>
      <input id="one-stop" type="range" min="1" max="49" value="25" />
      <div class="stint-row"><span>Finish</span>${tyreSelect('one-second', 2)}<span id="one-second-laps">25 laps</span></div>
    </section>

    <section class="strategy-builder">
      <div class="preset-title"><h2>Two stop</h2><span>3 stints</span></div>
      <div class="stint-row"><span>Start</span>${tyreSelect('two-first', 0)}<span id="two-first-laps">15 laps</span></div>
      <label class="stop-control" for="two-first-stop"><span>First stop after lap</span><output id="two-first-stop-output">15</output></label>
      <input id="two-first-stop" type="range" min="1" max="48" value="15" />
      <div class="stint-row"><span>Middle</span>${tyreSelect('two-second', 1)}<span id="two-second-laps">18 laps</span></div>
      <label class="stop-control" for="two-second-stop"><span>Second stop after lap</span><output id="two-second-stop-output">33</output></label>
      <input id="two-second-stop" type="range" min="2" max="49" value="33" />
      <div class="stint-row"><span>Finish</span>${tyreSelect('two-third', 2)}<span id="two-third-laps">17 laps</span></div>
    </section>
  </div>

  <div class="preset-results" aria-live="polite">Loading simulation…</div>
</main>`;
}

function time(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
}

export async function mountPlayground(root: HTMLElement): Promise<void> {
  const page = root.querySelector<HTMLElement>('.playground');
  if (!page) return;
  await loadSimulation();

  const input = (id: string): HTMLInputElement => page.querySelector<HTMLInputElement>(`#${id}`)!;
  const select = (id: string): HTMLSelectElement => page.querySelector<HTMLSelectElement>(`#${id}`)!;
  const setText = (id: string, value: string): void => {
    page.querySelector<HTMLElement>(`#${id}`)!.textContent = value;
  };

  const update = (): void => {
    const pitDelta = Number(input('pit-delta').value);
    const oneStop = Number(input('one-stop').value);
    let firstStop = Number(input('two-first-stop').value);
    let secondStop = Number(input('two-second-stop').value);

    if (firstStop >= secondStop) {
      if (document.activeElement === input('two-first-stop')) firstStop = secondStop - 1;
      else secondStop = firstStop + 1;
      input('two-first-stop').value = String(firstStop);
      input('two-second-stop').value = String(secondStop);
    }

    setText('pit-delta-output', `${pitDelta.toFixed(1)} s`);
    setText('one-stop-output', String(oneStop));
    setText('one-first-laps', `${oneStop} laps`);
    setText('one-second-laps', `${50 - oneStop} laps`);
    setText('two-first-stop-output', String(firstStop));
    setText('two-second-stop-output', String(secondStop));
    setText('two-first-laps', `${firstStop} laps`);
    setText('two-second-laps', `${secondStop - firstStop} laps`);
    setText('two-third-laps', `${50 - secondStop} laps`);

    const comparison = compare_strategies(
      pitDelta,
      Number(select('one-first').value), Number(select('one-second').value), oneStop,
      Number(select('two-first').value), Number(select('two-second').value),
      Number(select('two-third').value), firstStop, secondStop,
    );
    const rows = [
      { name: 'One stop', track: comparison.one_stop_track_seconds, pit: comparison.one_stop_pit_seconds, total: comparison.one_stop_total_seconds },
      { name: 'Two stop', track: comparison.two_stop_track_seconds, pit: comparison.two_stop_pit_seconds, total: comparison.two_stop_total_seconds },
    ];
    page.querySelector<HTMLElement>('.preset-results')!.innerHTML = `
      <div class="winner"><span>Quickest</span><strong>${comparison.winner}</strong> by ${comparison.winning_margin_seconds.toFixed(1)} s</div>
      <div class="comparison-table">${rows.map((row) => `
        <div class="comparison-row${row.name === comparison.winner ? ' best' : ''}">
          <strong>${row.name}</strong><span>Track ${time(row.track)}</span><span>Pits +${row.pit.toFixed(1)} s</span><b>${time(row.total)}</b>
        </div>`).join('')}</div>`;
  };

  page.addEventListener('input', update);
  page.addEventListener('change', update);
  update();
}
