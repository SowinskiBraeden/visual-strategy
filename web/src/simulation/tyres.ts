export type Compound = 'soft' | 'medium' | 'hard';

export interface TyreSpec {
  label: string;
  blocksPerLap: number;
  /** Laps a set stays usable before it has to come off. */
  maxLaps: number;
}

// Placeholder pace model: a lap on a compound costs a whole number of blocks.
// Degradation (blocks growing with tyre age) comes later, from the Rust model.
export const TYRES: Record<Compound, TyreSpec> = {
  soft: { label: 'Soft', blocksPerLap: 3, maxLaps: 8 },
  medium: { label: 'Medium', blocksPerLap: 4, maxLaps: 12 },
  hard: { label: 'Hard', blocksPerLap: 5, maxLaps: 20 },
};

export const COMPOUNDS: Compound[] = ['soft', 'medium', 'hard'];

export const PIT_LABEL = 'P';

export interface Stint {
  compound: Compound;
  laps: number;
}

export interface LapTime {
  lap: number;
  compound: Compound;
  blocks: number;
}

/** One entry per lap, in race order, so a chart can draw a whole strategy. */
export function expandStints(stints: Stint[]): LapTime[] {
  const laps: LapTime[] = [];

  for (const stint of stints) {
    for (let age = 1; age <= stint.laps; age++) {
      laps.push({
        lap: laps.length + 1,
        compound: stint.compound,
        blocks: TYRES[stint.compound].blocksPerLap,
      });
    }
  }

  return laps;
}

export function stintBlocks(stint: Stint): number {
  return stint.laps * TYRES[stint.compound].blocksPerLap;
}

export function totalBlocks(stints: Stint[]): number {
  return stints.reduce((sum, stint) => sum + stintBlocks(stint), 0);
}

/** Laps the car pits after, one per tyre change. */
export function pitLaps(stints: Stint[]): number[] {
  const laps: number[] = [];
  let run = 0;

  for (const stint of stints.slice(0, -1)) {
    run += stint.laps;
    laps.push(run);
  }

  return laps;
}
