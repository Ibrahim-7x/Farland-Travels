/**
 * One-off: convert every JPEG/PNG under public/ to WebP and delete the
 * original. Hero-size images are capped at 1600px wide, everything else at
 * 800px; quality starts at 80 and steps down until the file is ≤200 KB.
 *
 * Run from react-app/:  node scripts/compress-images.mjs
 * Source-code references must be updated separately (.jpg → .webp).
 */
import { readdir, readFile, unlink, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PUBLIC_DIR = fileURLToPath(new URL("../public/", import.meta.url));
const MAX_BYTES = 200 * 1024;
const MIN_QUALITY = 50;

/** Images rendered full-bleed (page heroes) keep more resolution. */
const isHeroSize = (relPath) =>
  relPath.includes("hero") ||
  relPath.endsWith("singapour-bali/singapore-bali-exc.jpg");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let totalBefore = 0;
let totalAfter = 0;
const rows = [];

for await (const file of walk(PUBLIC_DIR)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;

  const rel = path.relative(PUBLIC_DIR, file).replaceAll("\\", "/");
  const before = (await stat(file)).size;
  const width = isHeroSize(rel) ? 1600 : 800;

  // Feed sharp a buffer, not a path: on Windows the lazily-held input file
  // handle would otherwise make the unlink below fail with EBUSY.
  const input = await readFile(file);

  let quality = 80;
  let buffer;
  for (;;) {
    buffer = await sharp(input)
      .rotate() // bake in EXIF orientation before metadata is stripped
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    if (buffer.length <= MAX_BYTES || quality <= MIN_QUALITY) break;
    quality -= 10;
  }

  const out = file.replace(/\.(jpe?g|png)$/i, ".webp");
  await writeFile(out, buffer);
  await unlink(file);

  totalBefore += before;
  totalAfter += buffer.length;
  rows.push({ rel, before, after: buffer.length, width, quality });
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
for (const r of rows) {
  console.log(
    `${r.rel}  ${kb(r.before)} -> ${kb(r.after)}  (max ${r.width}px, q${r.quality})`
  );
}
console.log(
  `\nTotal: ${kb(totalBefore)} -> ${kb(totalAfter)} across ${rows.length} files`
);
