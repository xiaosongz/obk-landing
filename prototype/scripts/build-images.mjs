// Generates responsive WebP variants for every source image under
// public/images and writes src/image-manifest.json describing them.
//
//   public/images/home-02.png  ->  public/images/home-02.w480.webp, .w960.webp, ...
//
// Variants are created only at widths no larger than the source, plus one at
// the source width when the source is narrower than the largest step, so a
// srcset never advertises pixels that do not exist. Up-to-date variants are
// skipped, so repeated builds cost nothing. Sources stay untouched and are
// still deployed for anything that links to them directly.
import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { join, relative, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/images/", import.meta.url));
const manifestPath = fileURLToPath(
  new URL("../src/image-manifest.json", import.meta.url),
);
const WIDTHS = [160, 480, 960, 1600];
const QUALITY = 78;
// Infographics carry small text; lossy encoding softens it. Encode them
// losslessly (still about a third smaller than the PNG sources).
const LOSSLESS = /(^|\/)(process-[a-z]+|business-process)\.png$/;
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function variantPath(source, width) {
  const ext = extname(source);
  return join(dirname(source), `${basename(source, ext)}.w${width}.webp`);
}

async function newerThan(a, b) {
  try {
    const [sa, sb] = await Promise.all([stat(a), stat(b)]);
    return sa.mtimeMs >= sb.mtimeMs;
  } catch {
    return false;
  }
}

const manifest = {};
let generated = 0;
let skipped = 0;
for await (const source of walk(root)) {
  if (!SOURCE_EXT.has(extname(source).toLowerCase())) continue;
  const { width: sourceWidth } = await sharp(source).metadata();
  if (!sourceWidth) continue;
  const widths = WIDTHS.filter((w) => w <= sourceWidth);
  if (sourceWidth < WIDTHS[WIDTHS.length - 1] && !widths.includes(sourceWidth))
    widths.push(sourceWidth);
  for (const width of widths) {
    const target = variantPath(source, width);
    if (await newerThan(target, source)) {
      skipped++;
      continue;
    }
    await mkdir(dirname(target), { recursive: true });
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp(LOSSLESS.test(source) ? { lossless: true } : { quality: QUALITY })
      .toFile(target);
    generated++;
  }
  const key = "/images/" + relative(root, source).split("\\").join("/");
  manifest[key] = { widths, sourceWidth };
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `images: ${Object.keys(manifest).length} sources, ${generated} variants generated, ${skipped} up to date`,
);
