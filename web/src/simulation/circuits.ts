export interface Mark {
  x: number;
  y: number;
  text: string;
  anchor?: 'start' | 'middle' | 'end';
}

export interface Circuit {
  id: string;
  name: string;
  /** Seconds to get between the two markers through the pit road. */
  pitSeconds: number;
  /** Seconds to cover the same stretch at racing speed. */
  trackSeconds: number;
  view: string;
  /** Track either side of the measured section, for context only. */
  before: string;
  after: string;
  racing: string;
  pit: string;
  entry: [number, number];
  exit: [number, number];
  /** Direction of travel: [x, y, degrees]. */
  arrow: [number, number, number];
  marks: Mark[];
  entryAnchor?: 'start' | 'end';
  exitAnchor?: 'start' | 'end';
  /** Puts the two marker labels under their nodes instead of above. */
  labelsBelow?: boolean;
}

/*
 * Schematics of the pit lane and the stretch of track beside it, not surveys.
 * Each one keeps the shape and the orientation of the circuit's own map, so the
 * cars run the way they really do: right to left along the Rettilineo Box at
 * Monza and along the Hamilton Straight at Silverstone, and uphill from Rascasse
 * to Sainte Devote at Monaco. All three are clockwise, so the pit lane sits on
 * the inside of the lap.
 *
 *   Monza       entry at the exit of Parabolica, rejoins before Prima Variante.
 *   Monaco      entry just after Rascasse, pit lane along the harbour front,
 *               rejoins on the inside of Sainte Devote.
 *   Silverstone entry before Vale, skipping Vale and Club, rejoining at Farm
 *               Curve, so Abbey is missed too.
 */
export const CIRCUITS: Circuit[] = [
  {
    id: 'monza',
    name: 'Monza',
    pitSeconds: 38,
    trackSeconds: 16,
    view: '0 40 640 220',
    before:
      'M 470 70 C 540 70, 596 76, 618 102 C 638 126, 634 158, 614 178 C 596 196, 566 202, 536 203',
    after:
      'M 120 206 L 96 206 C 78 206, 70 196, 62 184 C 54 172, 42 166, 28 166',
    racing: 'M 520 204 L 120 206',
    pit: 'M 520 204 C 506 203, 499 194, 495 184 L 152 182 C 138 182, 128 192, 120 206',
    entry: [520, 204],
    exit: [120, 206],
    arrow: [330, 228, 180],
    marks: [
      { x: 566, y: 140, text: 'Parabolica' },
      { x: 330, y: 166, text: 'pit lane' },
      { x: 330, y: 248, text: 'Rettilineo Box' },
      { x: 24, y: 190, text: 'Prima Variante', anchor: 'start' },
    ],
    entryAnchor: 'end',
    exitAnchor: 'start',
    labelsBelow: true,
  },
  {
    id: 'monaco',
    name: 'Monaco',
    pitSeconds: 32,
    trackSeconds: 12.5,
    view: '40 15 330 300',
    before:
      'M 345 292 C 310 300, 268 298, 244 284 C 226 274, 222 256, 232 244',
    after: 'M 198 48 C 230 44, 262 52, 286 68',
    racing:
      'M 224 236 C 212 226, 198 220, 186 213 C 170 205, 162 195, 159 183 L 126 86 C 121 70, 129 56, 146 50 L 198 48',
    pit: 'M 224 236 C 226 222, 222 208, 190 196 L 157 92 C 152 76, 158 60, 172 52 C 181 47, 190 48, 198 48',
    entry: [224, 236],
    exit: [198, 48],
    arrow: [140, 140, -108],
    marks: [
      { x: 340, y: 310, text: 'Rascasse', anchor: 'end' },
      { x: 250, y: 258, text: 'Noghes', anchor: 'start' },
      { x: 200, y: 150, text: 'pit lane, harbour side', anchor: 'start' },
      { x: 120, y: 36, text: 'Sainte Dévote', anchor: 'end' },
    ],
    entryAnchor: 'start',
    exitAnchor: 'start',
  },
  {
    id: 'silverstone',
    name: 'Silverstone',
    pitSeconds: 45.5,
    trackSeconds: 23.5,
    view: '0 30 640 250',
    before: 'M 586 48 C 604 66, 608 92, 600 112',
    after: 'M 146 160 C 138 138, 124 120, 104 106',
    racing:
      'M 596 124 C 588 146, 572 156, 564 172 C 556 188, 560 204, 548 214 C 538 222, 520 226, 496 226 L 212 226 C 182 226, 162 214, 152 194 C 147 182, 146 170, 146 160',
    pit: 'M 596 124 C 576 142, 552 158, 534 168 L 200 186 C 180 188, 160 178, 146 160',
    entry: [596, 124],
    exit: [146, 160],
    arrow: [360, 248, 180],
    marks: [
      { x: 614, y: 44, text: 'Stowe', anchor: 'end' },
      { x: 604, y: 188, text: 'Vale', anchor: 'start' },
      { x: 556, y: 242, text: 'Club', anchor: 'start' },
      { x: 370, y: 166, text: 'pit lane' },
      { x: 360, y: 212, text: 'Hamilton Straight' },
      { x: 196, y: 250, text: 'Abbey', anchor: 'middle' },
      { x: 118, y: 148, text: 'Farm', anchor: 'end' },
    ],
    entryAnchor: 'end',
    exitAnchor: 'start',
  },
];

export function pitDelta(circuit: Circuit): number {
  return Number((circuit.pitSeconds - circuit.trackSeconds).toFixed(1));
}
