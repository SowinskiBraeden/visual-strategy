import type { LapTime } from '../simulation/tyres.ts';

export interface PlotOptions {
  laps: LapTime[];
  /** X axis extent, so an unfinished race still shows the laps ahead. */
  totalLaps?: number;
  /** Draws a pit marker after each of these laps. */
  pitAfterLaps?: number[];
}

export interface TimeBlocksOptions extends PlotOptions {
  /** Y axis extent, so the scale holds still while the strategy changes. */
  maxBlocks?: number;
  blockSize?: number;
  /** Markup placed under the x axis, aligned with the plot (e.g. a pit slider). */
  control?: string;
}

/** Columns and pit marker only, so a redraw leaves the axis and control alone. */
export function plotMarkup({
  laps,
  totalLaps = laps.length,
  pitAfterLaps = [],
}: PlotOptions): string {
  const columns = Array.from({ length: totalLaps }, (_, i) => {
    const lap = laps[i];
    if (!lap) return '<div class="col"></div>';
    return `<div class="col" data-compound="${lap.compound}">${'<i></i>'.repeat(lap.blocks)}</div>`;
  }).join('');

  const pits = pitAfterLaps
    .map((lap) => `<div class="pit-marker" style="--pit: ${lap}"><span>P</span></div>`)
    .join('');

  return pits + columns;
}

export function timeBlocks({
  laps,
  totalLaps = laps.length,
  maxBlocks,
  pitAfterLaps = [],
  blockSize = 26,
  control = '',
}: TimeBlocksOptions): string {
  const rows = maxBlocks ?? Math.max(1, ...laps.map((lap) => lap.blocks));

  const ticks = Array.from(
    { length: totalLaps },
    (_, i) => `<span>${i + 1}</span>`,
  ).join('');

  return `
<figure class="chart" style="--laps: ${totalLaps}; --rows: ${rows}; --block: ${blockSize}px">
  <p class="chart-y">Lap time<br /><span>(blocks)</span></p>
  <div class="plot">${plotMarkup({ laps, totalLaps, pitAfterLaps })}</div>
  <p class="chart-x">Laps</p>
  <div class="axis">${ticks}</div>
  ${control ? `<div class="control">${control}</div>` : ''}
</figure>`;
}
