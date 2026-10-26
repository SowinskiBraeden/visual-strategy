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
  /** Final viewBox, after rotation: see `outlineTransform`. */
  view: string;
  /** Rotates (and recenters) the circuit's own outline (see
   * src/assets/track-outlines.ts) from its native orientation into `view`,
   * so the pit straight runs horizontally. */
  outlineTransform: string;
  /** The pit-straight stretch of the real racing line, traced from the
   * outline and rotated the same way as `outlineTransform`. */
  racing: string;
  /** The pit road: not in the source outline, so drawn by hand, offset to
   * whichever side the real pit lane sits on and curved like a slip road,
   * tangent to the racing line at both ends. */
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
 * Each schematic shows the circuit's own outline (see
 * src/assets/track-outlines.ts, traced from the official track maps in
 * src/assets/track_svgs), rotated so the pit straight runs horizontally
 * (Monza keeps the full lap; Monaco and Silverstone are cropped to the
 * pit-straight area plus the corners either side of it, per the pitSeconds/
 * trackSeconds stretch). The source outlines don't include the physical pit
 * road, so that line is the one hand-drawn addition: offset to the side the
 * real pit lane sits on, tangent to the racing line at both ends like a
 * slip road.
 *
 *   Monza       entry at the exit of Parabolica, rejoins before Prima
 *               Variante. Pit lane runs on the outside of Rettilineo Box.
 *   Monaco      entry just after Rascasse, rejoins on the inside of Sainte
 *               Devote; pit lane runs above the racing line.
 *   Silverstone entry before Club, rejoins just after Abbey; pit lane runs
 *               below the racing line, alongside the Hamilton Straight.
 */
export const CIRCUITS: Circuit[] = [
  {
    id: 'monza',
    name: 'Monza',
    pitSeconds: 38,
    trackSeconds: 16,
    view: '0 0 768.0 404.5',
    outlineTransform: 'translate(10, 410) rotate(-94)',
    racing:
      'M 615.9,348.6 L 609.3,350.0 L 601.3,350.6 L 593.2,351.2 L 584.7,351.8 L 572.4,352.2 L 550.4,352.8 L 533.5,353.1 L 527.9,352.9 L 519.3,352.8 L 507.7,352.6 L 496.1,352.5 L 484.1,352.3 L 472.2,352.0 L 460.5,351.4 L 448.8,350.8 L 436.9,350.6 L 424.8,350.4 L 412.3,350.3 L 399.8,350.1 L 387.1,349.5 L 380.0,348.6',
    pit: 'M 615.9,348.6 L 609.2,349.6 L 601.2,348.8 L 592.9,347.2 L 584.4,344.9 L 572.1,341.1 L 550.1,337.8 L 533.4,338.1 L 528.2,337.9 L 519.5,337.8 L 508.0,337.6 L 496.3,337.5 L 484.4,337.3 L 472.7,337.0 L 461.3,336.5 L 449.4,335.9 L 437.1,336.3 L 424.9,339.0 L 412.4,343.0 L 399.9,347.0 L 387.1,349.1 L 380.0,348.6',
    entry: [615.9, 348.6],
    exit: [380.0, 348.6],
    arrow: [220.2, 181.7, 45],
    marks: [{ x: 533.3, y: 324.1, text: 'pit lane' }],
    entryAnchor: 'start',
    exitAnchor: 'end',
    labelsBelow: true,
  },
  {
    id: 'monaco',
    name: 'Monaco',
    pitSeconds: 32,
    trackSeconds: 12.5,
    view: '0 0 397.8 116.0',
    outlineTransform: 'translate(-321.61 20.25) rotate(282.29)',
    racing:
      'M 367.9,60.7 L 368.1,63.9 L 368.0,68.1 L 367.8,72.0 L 367.4,75.4 L 366.8,78.1 L 366.3,80.6 L 365.7,82.8 L 364.8,84.8 L 363.4,86.6 L 361.5,88.2 L 359.1,89.5 L 356.4,90.5 L 353.2,90.8 L 349.5,90.7 L 345.2,90.6 L 340.5,91.1 L 335.5,92.5 L 329.7,94.3 L 323.1,96.3 L 315.7,98.8 L 307.4,101.5 L 298.3,104.0 L 288.2,106.0 L 277.3,107.7 L 265.5,109.2 L 253.4,110.2 L 240.9,111.1 L 227.7,111.8 L 213.8,112.3 L 198.9,112.4 L 183.7,111.8 L 163.4,109.5 L 148.4,107.3 L 143.8,106.5 L 136.8,105.5 L 127.3,104.2 L 117.8,103.0 L 108.1,101.4 L 98.5,99.3 L 88.9,96.6 L 79.1,93.2 L 69.6,89.6 L 60.1,85.7',
    pit: 'M 367.9,60.7 L 368.1,63.9 L 367.8,68.1 L 367.3,71.9 L 366.6,75.3 L 365.7,77.9 L 364.9,80.2 L 364.0,82.2 L 362.9,83.7 L 361.5,84.8 L 359.7,85.7 L 357.7,86.2 L 355.5,86.4 L 353.1,85.9 L 349.6,85.0 L 344.9,83.9 L 339.0,83.4 L 332.9,83.8 L 326.6,84.4 L 319.5,85.2 L 311.6,86.6 L 303.5,88.4 L 295.1,90.4 L 285.8,92.2 L 275.4,93.9 L 264.1,95.2 L 252.3,96.3 L 240.0,97.1 L 227.0,97.8 L 213.5,98.3 L 199.2,98.4 L 184.8,97.8 L 165.2,95.6 L 150.6,93.5 L 145.9,92.9 L 138.5,92.4 L 128.8,92.5 L 119.2,93.1 L 109.5,93.7 L 99.8,93.9 L 89.9,93.4 L 79.7,91.8 L 69.7,89.2 L 60.1,85.7',
    entry: [367.9, 60.7],
    exit: [60.1, 85.7],
    arrow: [214.3, 87.6, 179.8],
    marks: [{ x: 291.9, y: 76.8, text: 'pit lane' }],
    entryAnchor: 'start',
    exitAnchor: 'end',
    labelsBelow: true,
  },
  {
    id: 'silverstone',
    name: 'Silverstone',
    pitSeconds: 45.5,
    trackSeconds: 23.5,
    view: '0 0 460.3 326.9',
    outlineTransform: 'scale(1.5) translate(-150.71 455.28) rotate(234.41)',
    racing:
      'M 394.2,60.3 L 394.5,64.5 L 393.0,71.1 L 391.3,77.5 L 389.9,83.5 L 388.7,88.6 L 387.8,92.9 L 387.1,96.6 L 386.2,100.0 L 385.7,103.1 L 385.7,105.8 L 386.5,108.4 L 387.7,110.9 L 389.7,113.1 L 392.3,115.3 L 395.7,117.1 L 399.4,118.5 L 403.3,119.0 L 407.1,119.3 L 410.7,120.4 L 414.7,122.0 L 418.3,124.0 L 421.4,126.4 L 423.5,129.5 L 425.0,133.3 L 425.8,137.8 L 425.8,142.6 L 425.5,147.6 L 424.9,153.2 L 423.5,158.8 L 421.8,163.9 L 420.4,168.6 L 419.0,173.3 L 417.2,178.3 L 415.1,183.5 L 412.5,188.8 L 409.2,194.0 L 405.8,198.5 L 402.2,202.8 L 398.3,207.1 L 394.4,210.9 L 390.0,214.0 L 384.8,216.8 L 379.2,219.1 L 373.5,220.1 L 367.6,220.1 L 360.8,219.6 L 353.6,219.4 L 346.9,219.4 L 337.1,218.8 L 328.3,218.3 L 323.6,218.7 L 312.0,218.9 L 284.5,219.2 L 245.9,219.4 L 209.5,219.6 L 186.0,219.8 L 173.9,219.6 L 164.4,219.4 L 155.3,219.4 L 147.1,219.4 L 139.4,219.4 L 131.9,219.2 L 124.6,219.3 L 117.5,219.4 L 111.0,219.4 L 104.9,218.8 L 98.7,217.6 L 92.6,215.5 L 86.9,212.7 L 81.7,209.4 L 76.9,205.1 L 72.3,200.1 L 68.1,194.2 L 64.2,187.4 L 60.7,180.2 L 57.2,173.1 L 53.6,166.4 L 49.7,159.7 L 45.8,153.0 L 42.1,146.5 L 38.0,140.3 L 33.4,134.4 L 28.4,128.6 L 23.3,123.0 L 17.8,117.9 L 12.3,112.3',
    pit: 'M 394.2,60.3 L 391.8,63.0 L 389.4,66.4 L 387.1,70.4 L 384.9,74.9 L 382.9,79.9 L 380.9,85.4 L 379.0,91.4 L 377.3,97.7 L 375.7,104.3 L 374.2,111.3 L 372.8,118.5 L 371.6,126.0 L 370.5,133.7 L 369.6,141.5 L 368.8,149.3 L 368.2,157.3 L 367.7,165.3 L 367.4,173.2 L 367.3,181.2 L 367.3,182.1 L 367.3,186.3 L 366.8,190.0 L 365.8,193.3 L 364.4,196.1 L 362.5,198.4 L 360.1,200.3 L 357.4,201.7 L 354.1,202.7 L 350.4,203.2 L 346.2,203.3 L 338.0,202.8 L 328.4,202.3 L 323.0,202.7 L 311.8,202.9 L 284.4,203.2 L 245.8,203.4 L 209.4,203.6 L 186.0,203.8 L 174.2,203.6 L 164.5,203.4 L 155.3,203.4 L 147.1,203.4 L 139.7,203.4 L 132.0,203.2 L 124.4,203.4 L 117.4,203.7 L 111.8,204.1 L 107.1,204.0 L 102.4,203.6 L 97.8,202.6 L 93.4,201.2 L 89.3,199.4 L 85.1,196.8 L 80.8,193.3 L 76.4,188.9 L 71.9,183.3 L 67.5,176.9 L 62.9,170.1 L 58.3,163.8 L 53.4,157.5 L 48.8,151.3 L 44.2,145.1 L 39.5,139.3 L 34.3,133.6 L 28.9,128.2 L 23.5,122.8 L 17.8,117.9 L 12.3,112.3',
    entry: [394.2, 60.3],
    exit: [12.3, 112.3],
    arrow: [281.4, 254.3, 180],
    marks: [{ x: 280, y: 186, text: 'pit lane' }],
    entryAnchor: 'start',
    exitAnchor: 'end',
  },
];

export function pitDelta(circuit: Circuit): number {
  return Number((circuit.pitSeconds - circuit.trackSeconds).toFixed(1));
}
