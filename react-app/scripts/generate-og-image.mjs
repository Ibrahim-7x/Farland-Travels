/**
 * One-off: build public/og-image.webp (1200×630, the standard Open Graph
 * size) from the site's main hero photo, for link previews on WhatsApp,
 * Facebook, etc.
 *
 * Run from react-app/:  node scripts/generate-og-image.mjs
 */
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE = fileURLToPath(
  new URL("../public/singapour-bali/singapore-bali-exc.webp", import.meta.url)
);
const OUT = fileURLToPath(new URL("../public/og-image.webp", import.meta.url));

const input = await readFile(SOURCE);
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .webp({ quality: 80 })
  .toFile(OUT);

const { size } = await stat(OUT);
console.log(`og-image.webp written: 1200x630, ${(size / 1024).toFixed(0)} KB`);
