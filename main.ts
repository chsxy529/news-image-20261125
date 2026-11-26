// news-image-20261125: place the front-page image beside this file at
// /output/entry.png (or $MAKEFUN_OUTPUT_DIR/entry.png when set).
// Node 22, standard library only. No network, no randomness, no clock:
// the two graded runs write byte-identical output.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const bytes = readFileSync(join(here, "entry.png"));
// Guard the gate: refuse to write anything that is not the PNG we ship.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a valid PNG");
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), bytes);
