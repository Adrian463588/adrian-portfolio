import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const rootDir = process.cwd();
const siteConfigPath = path.join(rootDir, "src", "config", "site.config.ts");
const siteConfigSrc = fs.readFileSync(siteConfigPath, "utf8");
const urlMatch = siteConfigSrc.match(/url:\s*"([^"]+)"/);

if (!urlMatch) {
  throw new Error("Could not extract canonical url from src/config/site.config.ts");
}

const canonicalUrl = urlMatch[1].replace(/\/+$/, "") + "/";
if (canonicalUrl !== "https://adriansyahabidin.vercel.app/") {
  throw new Error(`Unexpected canonical QR URL: ${canonicalUrl}`);
}

const rawSvg = await QRCode.toString(canonicalUrl, {
  type: "svg",
  errorCorrectionLevel: "Q",
  margin: 4,
  color: {
    dark: "#08090C",
    light: "#FFFFFF",
  },
});

const hasCrisp = /shape-rendering=/.test(rawSvg);
const crispSvg = rawSvg.replace(
  "<svg ",
  `<svg ${hasCrisp ? "" : 'shape-rendering="crispEdges" '}role="img" aria-label="QR code linking to https://adriansyahabidin.vercel.app/" `
);

const outFile = path.join(rootDir, "public", "images", "profile", "portfolio-qr.svg");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, crispSvg, "utf8");
console.log(`Generated static crisp QR SVG for ${canonicalUrl} at ${path.relative(rootDir, outFile)}`);
