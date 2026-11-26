import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");

/**
 * Vector SVG emblem matching Obsidian & Arctic tokens (`#08090C`, `#1C1F26`, `#F2F0EC`, `#65C8F5`)
 * Inspired by the Navbar wordmark ("Adrian."): bold geometric "A" + Arctic Cyan period accent.
 * Sized cleanly inside safe zones so small 16px/48px favicons and maskable launchers never clip.
 */
function buildIconSvg({ rounded = true, fullBleedBg = false } = {}) {
  const outerShape = rounded
    ? `<rect width="512" height="512" rx="112" fill="#08090C" />
       <rect x="12" y="12" width="488" height="488" rx="100" stroke="#1C1F26" stroke-width="18" />`
    : `<rect width="512" height="512" fill="#08090C" />${
        fullBleedBg ? "" : '<rect x="14" y="14" width="484" height="484" stroke="#1C1F26" stroke-width="14" />'
      }`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  ${outerShape}
  <!-- Geometric 'A.' centered horizontally across the full glyph + dot bounds (108..404 -> center 256) -->
  <path d="M108 378L194 134H248L334 378H278L259.5 320H182.5L164 378H108ZM197.5 272H244.5L221 196L197.5 272Z" fill="#F2F0EC" />
  <circle cx="372" cy="348" r="32" fill="#65C8F5" />
</svg>\n`;
}

function buildMaskSvg() {
  // Maskable icons require essential glyph within inner ~72% radius
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#08090C" />
  <g transform="translate(51.2 51.2) scale(0.8)">
    <path d="M108 378L194 134H248L334 378H278L259.5 320H182.5L164 378H108ZM197.5 272H244.5L221 196L197.5 272Z" fill="#F2F0EC" />
    <circle cx="372" cy="348" r="32" fill="#65C8F5" />
  </g>
</svg>\n`;
}

async function renderSvgToPngBuffer(page, svgMarkup, size) {
  await page.setViewportSize({ width: size, height: size });
  const encoded = Buffer.from(svgMarkup, "utf8").toString("base64");
  await page.setContent(
    `<!doctype html><html><body style="margin:0;padding:0;overflow:hidden;background:transparent;"><img src="data:image/svg+xml;base64,${encoded}" width="${size}" height="${size}" style="display:block;width:${size}px;height:${size}px;" /></body></html>`,
    { waitUntil: "load" }
  );
  return await page.screenshot({
    type: "png",
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size },
  });
}

function buildMultiResIco(frames) {
  // ICONDIR (6 bytes) + N * ICONDIRENTRY (16 bytes) + concatenated PNG payloads
  const headerSize = 6 + frames.length * 16;
  const totalSize = headerSize + frames.reduce((sum, f) => sum + f.buffer.length, 0);
  const out = Buffer.alloc(totalSize);

  out.writeUInt16LE(0, 0); // Reserved
  out.writeUInt16LE(1, 2); // Icon type
  out.writeUInt16LE(frames.length, 4); // Image count

  let offset = headerSize;
  frames.forEach((frame, idx) => {
    const entryOffset = 6 + idx * 16;
    const dim = frame.size >= 256 ? 0 : frame.size;
    out.writeUInt8(dim, entryOffset);
    out.writeUInt8(dim, entryOffset + 1);
    out.writeUInt8(0, entryOffset + 2); // Color count
    out.writeUInt8(0, entryOffset + 3); // Reserved
    out.writeUInt16LE(1, entryOffset + 4); // Planes
    out.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    out.writeUInt32LE(frame.buffer.length, entryOffset + 8);
    out.writeUInt32LE(offset, entryOffset + 12);

    frame.buffer.copy(out, offset);
    offset += frame.buffer.length;
  });

  return out;
}

async function main() {
  fs.mkdirSync(publicDir, { recursive: true });

  const browserIconSvg = buildIconSvg({ rounded: true });
  const appleIconSvg = buildIconSvg({ rounded: false, fullBleedBg: true });
  const maskableSvg = buildMaskSvg();

  fs.writeFileSync(path.join(publicDir, "icon.svg"), browserIconSvg, "utf8");

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });

    // Generate Google Search & Browser standard multi-48px PNGs
    for (const size of [48, 96, 144, 192, 512]) {
      const png = await renderSvgToPngBuffer(page, browserIconSvg, size);
      fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), png);
    }

    // Generate opaque Apple Touch Icon (180x180) and Maskable Android Icon (512x512)
    const applePng = await renderSvgToPngBuffer(page, appleIconSvg, 180);
    fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), applePng);

    const maskablePng = await renderSvgToPngBuffer(page, maskableSvg, 512);
    fs.writeFileSync(path.join(publicDir, "icon-maskable-512x512.png"), maskablePng);

    // Build genuine multi-resolution favicon.ico (16x16, 32x32, 48x48)
    const icoFrames = [];
    for (const size of [16, 32, 48]) {
      const png = await renderSvgToPngBuffer(page, browserIconSvg, size);
      icoFrames.push({ size, buffer: png });
    }
    const icoBuffer = buildMultiResIco(icoFrames);
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);

    console.log("Generated icons cleanly in public/: icon.svg, favicon.ico (16/32/48), icon-{48,96,144,192,512}x*.png, icon-maskable-512x512.png, apple-touch-icon.png");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
