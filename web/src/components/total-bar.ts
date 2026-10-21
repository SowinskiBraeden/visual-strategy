import type { Compound } from '../simulation/tyres.ts';

export interface TotalSegment {
  /** 'pit' draws the stop itself as a segment, once its cost is known. */
  compound: Compound | 'pit';
  blocks: number;
}

/** One blue P per stop, for the stages where a stop has no number yet. */
export function pitChips(stops: number): string {
  return Array.from({ length: stops }, () => '<span class="pit-chip">P</span>').join(
    '',
  );
}

export interface TotalBarOptions {
  label?: string;
  segments: TotalSegment[];
  pitStops?: number;
  /** Marks the bar as the quickest option available. */
  best?: boolean;
}

export function totalBar({
  label = 'Race time',
  segments,
  pitStops = 0,
  best = false,
}: TotalBarOptions): string {
  const total = segments.reduce((sum, segment) => sum + segment.blocks, 0);

  const bar = segments
    .filter((segment) => segment.blocks > 0)
    .map(
      (segment) =>
        `<span class="seg" data-compound="${segment.compound}" style="--w: ${segment.blocks}">${segment.blocks}</span>`,
    )
    .join('');

  const pits = pitStops > 0 ? ` + ${pitChips(pitStops)}` : '';

  return `
<div class="totals${best ? ' best' : ''}">
  <span class="totals-label">${label}</span>
  <div class="bar">${bar}</div>
  <span class="sum">= ${total}${pits}</span>
</div>`;
}
