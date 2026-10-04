// Run from any directory: node scripts/generate-share-assets.mjs
// Uses Astro's installed Sharp/fontkitten and the existing bundled fonts only.
import sharp from 'sharp';
import { create } from 'fontkitten';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/data/routes.js';

const root = new URL('../', import.meta.url);
const local = path => fileURLToPath(new URL(path, root));
const ink = '#1b1917', paper = '#efe9dd', copper = '#f0ab88';
const headingFont = create(await readFile(local('public/fonts/league-gothic-latin-400-normal.woff2')));
const bodyFont = create(await readFile(local('public/fonts/alegreya-sans-latin-400-normal.woff2')));

// Bake every glyph into native SVG geometry: no SVG <text>, CSS font loading,
// system-font substitutions, or browser-only font references at rasterization.
function lettering(copy, font, size, baseline, colour = paper, maxWidth = 580, centre = 600) {
  const glyphs = font.glyphsForString(copy);
  const advance = glyphs.reduce((sum, glyph) => sum + glyph.advanceWidth, 0);
  const scale = Math.min(size / font.unitsPerEm, maxWidth / advance);
  let x = centre - advance * scale / 2;
  return glyphs.map(glyph => {
    const path = `<path fill="${colour}" transform="translate(${x.toFixed(4)} ${baseline}) scale(${scale} ${-scale})" d="${glyph.path.toSVG()}"/>`;
    x += glyph.advanceWidth * scale;
    return path;
  }).join('');
}

await mkdir(local('public/og'), { recursive: true });
for (const [route, metadata] of Object.entries(pages)) {
  const { heading, lines, picture } = metadata.card;
  if (route === '/') {
    // Home alone uses the natural suit portrait. Keep home-v1.jpg untouched:
    // already-shared links may still request that original asset URL.
    const portrait = await sharp(local(`public/img/${picture}.webp`))
      .resize(440, 550, { fit: 'inside' }).png().toBuffer();
    // The central square (x=285..915) retains the face, suit and all copy.
    const graphics = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="${ink}"/>
      ${lettering('Chuka', headingFont, 90, 209, paper, 270, 775)}
      ${lettering('Dele-Oyeleru', headingFont, 80, 295, paper, 270, 775)}
      <path d="M665 323H885" stroke="${copper}" stroke-width="2"/>
      ${lettering('Strategy &', bodyFont, 38, 377, copper, 270, 775)}
      ${lettering('Operations', bodyFont, 38, 419, copper, 270, 775)}
      ${lettering('chukadele.com', bodyFont, 32, 495, paper, 270, 775)}
    </svg>`;
    const output = local(`public${metadata.image}`);
    await sharp(Buffer.from(graphics)).composite([{ input: portrait, left: 190, top: 40 }])
      .jpeg({ quality: 86, chromaSubsampling: '4:4:4', progressive: true }).toFile(output);
    console.log(`${metadata.image}: ${(await readFile(output)).length} bytes`);
    continue;
  }
  // Contain the complete supplied image: no filters, retouching or removed content.
  const plate = await sharp(local(`public/img/${picture}.webp`))
    .resize(1040, 250, { fit: 'inside' }).png().toBuffer({ resolveWithObject: true });
  const isHome = route === '/';
  const graphics = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${ink}"/>
    <path d="M80 294H1120" stroke="${paper}" stroke-opacity=".25"/>
    ${lettering(heading, headingFont, isHome ? 82 : 86, 386)}
    <path d="M452 405 C515 400 612 409 744 402" fill="none" stroke="${copper}" stroke-width="3" stroke-linecap="round"/>
    ${lines.map((line, i) => lettering(line, bodyFont, isHome ? 38 : 32, 451 + i * 36, copper)).join('')}
    ${!isHome ? lettering('Chuka Dele-Oyeleru', bodyFont, 27, 541) : ''}
    ${lettering('chukadele.com', bodyFont, 27, 586)}
  </svg>`;
  const output = local(`public${metadata.image}`);
  await sharp(Buffer.from(graphics)).composite([{
    input: plate.data, left: Math.round((1200 - plate.info.width) / 2), top: 24,
  }]).jpeg({ quality: 86, chromaSubsampling: '4:4:4', progressive: true }).toFile(output);
  console.log(`${metadata.image}: ${(await readFile(output)).length} bytes`);
}

// The existing high-contrast C mark is the source of truth at every size.
const icon = await readFile(local('public/favicon.svg'));
for (const size of [32, 48, 192, 512, 180]) {
  const filename = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  await sharp(icon).resize(size, size).png().toFile(local(`public/${filename}`));
}

// ICO directory plus standard 32-bit DIB entries (including the AND masks),
// rather than relying on nonstandard PNG-only support in older icon readers.
const sizes = [16, 32, 48];
const entries = [];
for (const size of sizes) {
  const rgba = await sharp(icon).resize(size, size).ensureAlpha().raw().toBuffer();
  const maskStride = Math.ceil(size / 32) * 4;
  const dib = Buffer.alloc(40 + size * size * 4 + maskStride * size);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(size, 4);
  dib.writeInt32LE(size * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(size * size * 4 + maskStride * size, 20);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const source = (y * size + x) * 4;
    const target = 40 + ((size - 1 - y) * size + x) * 4;
    dib.set([rgba[source + 2], rgba[source + 1], rgba[source], rgba[source + 3]], target);
    if (rgba[source + 3] === 0) {
      dib[40 + size * size * 4 + (size - 1 - y) * maskStride + Math.floor(x / 8)] |= 128 >> (x % 8);
    }
  }
  entries.push(dib);
}
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
entries.forEach((entry, i) => {
  const start = 6 + i * 16;
  directory[start] = directory[start + 1] = sizes[i];
  directory.writeUInt16LE(1, start + 4);
  directory.writeUInt16LE(32, start + 6);
  directory.writeUInt32LE(entry.length, start + 8);
  directory.writeUInt32LE(offset, start + 12);
  offset += entry.length;
});
await writeFile(local('public/favicon.ico'), Buffer.concat([directory, ...entries]));
console.log('Generated icon PNGs and 16/32/48-pixel favicon.ico.');
