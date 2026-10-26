import monza from './track_svgs/monza.svg?raw';
import monaco from './track_svgs/monaco.svg?raw';
import silverstone from './track_svgs/silverstone.svg?raw';

/**
 * The source files carry the full lap three times over (a thick grey casing,
 * then the same geometry again as red/blue/yellow mini-sectors, plus a frozen
 * telemetry cursor). For the pit-delta schematic we only want the plain
 * outline, so the sector colouring and the cursor are stripped here, once,
 * at import time.
 */
function outlineOnly(raw: string): string {
  return raw
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<g id="moving-circle-group">[\s\S]*?<\/g>/, '')
    .replace(/<path d="[^"]*" stroke="#(?:EF4444|3B82F6|FBBF24)"[^/]*\/>/g, '');
}

export const TRACK_OUTLINES: Record<string, string> = {
  monza: outlineOnly(monza),
  monaco: outlineOnly(monaco),
  silverstone: outlineOnly(silverstone),
};
