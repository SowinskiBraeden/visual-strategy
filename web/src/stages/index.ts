import { compoundPace } from './compound-pace.ts';
import { howManyStops } from './how-many-stops.ts';
import { pitDeltaStage } from './pit-delta.ts';
import { twoCompoundRule } from './two-compound-rule.ts';

export interface Stage {
  id: string;
  title: string;
  lede: string;
  /** Markup for the demo area. */
  render(): string;
  /** Wires the demo up. Listeners go on `body`, which survives a redraw. */
  mount?(body: HTMLElement): void;
}

export const stages: Stage[] = [
  compoundPace,
  twoCompoundRule,
  howManyStops,
  pitDeltaStage,
];

export function stageIndex(param: string | undefined): number {
  const n = Number(param);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(Math.trunc(n) - 1, 0), stages.length - 1);
}
