// news-image-20261125 entry (Node 22, standard library only).
// The entry image is the entry.png beside this file: a newspaper front page
// summing up the world's news of Wednesday 25 November 2026. The program
// reads it, verifies it is really a PNG, and writes it to /output/entry.png.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const source = new URL('./entry.png', import.meta.url);
const image = readFileSync(source);

if (image.length < PNG_MAGIC.length || !image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG: its first 8 bytes are not the PNG signature');
}

// A whole PNG also opens with an IHDR chunk and ends with an IEND chunk.
// Refuse anything truncated or padded, and anything over the 1 MiB gate cap.
if (image.length < 33 || image.length > 1048576) {
  throw new Error(`entry.png has an impossible size for this entry: ${image.length} bytes`);
}
if (image.subarray(12, 16).toString('latin1') !== 'IHDR') {
  throw new Error('entry.png is not a whole PNG: its first chunk is not IHDR');
}
const iend = image.subarray(image.length - 12);
if (iend.readUInt32BE(0) !== 0 || iend.subarray(4, 8).toString('latin1') !== 'IEND') {
  throw new Error('entry.png is not a whole PNG: it does not end with an IEND chunk');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);
