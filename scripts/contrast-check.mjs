import fs from 'node:fs';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function srgbToLin(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relLuma({ r, g, b }) {
  const R = srgbToLin(r);
  const G = srgbToLin(g);
  const B = srgbToLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrast(hex1, hex2) {
  const L1 = relLuma(hexToRgb(hex1));
  const L2 = relLuma(hexToRgb(hex2));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const cfg = JSON.parse(fs.readFileSync('design/contrast-pairs.json', 'utf-8'));
let fail = false;

for (const p of cfg.pairs) {
  if (p.fg.startsWith('__') || p.bg.startsWith('__')) {
    console.error(`Contrast pair "${p.name}" is not configured. Fill hex values.`);
    fail = true;
    continue;
  }
  const ratio = contrast(p.fg, p.bg);
  const ok = ratio >= cfg.threshold;
  console.log(`${p.name}: ${ratio.toFixed(2)} ${ok ? 'OK' : 'FAIL'}`);
  if (!ok) fail = true;
}

if (fail) process.exit(1);
