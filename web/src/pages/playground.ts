import { compare_presets } from 'visual-strategy';
import { loadSimulation } from '../simulation/wasm.ts';

export function playground(): string {
  return `
<main class="page playground">
  <p class="eyebrow">50-lap race</p>
  <h1>Playground</h1>
  <p class="lede">Move the pit-loss slider to see when faster tyres justify an extra stop.</p>

  <section class="playground-control" aria-labelledby="pit-delta-label">
    <div>
      <label id="pit-delta-label" for="pit-delta">Pit loss</label>
      <p>Time lost each time the car enters the pits.</p>
    </div>
    <output id="pit-delta-output" for="pit-delta">20.0 s</output>
    <input id="pit-delta" type="range" min="10" max="30" step="0.5" value="20" />
  </section>

  <div class="preset-results" aria-live="polite">Loading simulation…</div>
</main>`;
}

function time(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
}

export async function mountPlayground(root: HTMLElement): Promise<void> {
  const slider = root.querySelector<HTMLInputElement>('#pit-delta');
  const output = root.querySelector<HTMLOutputElement>('#pit-delta-output');
  const results = root.querySelector<HTMLElement>('.preset-results');
  if (!slider || !output || !results) return;

  await loadSimulation();

  const update = (): void => {
    const pitDelta = Number(slider.value);
    const comparison = compare_presets(pitDelta);
    output.value = `${pitDelta.toFixed(1)} s`;

    const presets = [
      {
        name: 'One stop', tyres: '25 laps Medium · 25 laps Hard', stops: 1,
        track: comparison.one_stop_track_seconds,
        pit: comparison.one_stop_pit_seconds,
        total: comparison.one_stop_total_seconds,
      },
      {
        name: 'Two stop', tyres: '15 laps Soft · 18 laps Medium · 17 laps Hard', stops: 2,
        track: comparison.two_stop_track_seconds,
        pit: comparison.two_stop_pit_seconds,
        total: comparison.two_stop_total_seconds,
      },
    ];

    results.innerHTML = `
      <div class="winner"><span>Quickest</span><strong>${comparison.winner}</strong> by ${comparison.winning_margin_seconds.toFixed(1)} s</div>
      <div class="preset-grid">
        ${presets.map((preset) => `
          <article class="preset-card${preset.name === comparison.winner ? ' best' : ''}">
            <div class="preset-title"><h2>${preset.name}</h2><span>${preset.stops} stop${preset.stops > 1 ? 's' : ''}</span></div>
            <p>${preset.tyres}</p>
            <dl>
              <div><dt>Track time</dt><dd>${time(preset.track)}</dd></div>
              <div><dt>Pit loss</dt><dd>+ ${preset.pit.toFixed(1)} s</dd></div>
              <div class="preset-total"><dt>Total</dt><dd>${time(preset.total)}</dd></div>
            </dl>
          </article>`).join('')}
      </div>`;
  };

  slider.addEventListener('input', update);
  update();
}
