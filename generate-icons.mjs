// Run from your project root: node generate-icons.mjs
// Generates all placeholder icons into public/icons/
// No dependencies needed — pure Node.js

import { createWriteStream, mkdirSync } from 'fs';
import { createDeflate } from 'zlib';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import path from 'path';

const OUT_DIR = './public/icons';
mkdirSync(OUT_DIR, { recursive: true });

// ── Tiny PNG writer ──────────────────────────────────────────────────────────
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) {
    c ^= b;
    for (let i = 0; i < 8; i++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(tag, data) {
  const t = Buffer.from(tag);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
async function writePNG(filepath, pixels, w, h) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // filter
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = pixels[y * w + x];
      const o = y * (1 + w * 4) + 1 + x * 4;
      raw[o] = r; raw[o+1] = g; raw[o+2] = b; raw[o+3] = a;
    }
  }
  // deflate
  const chunks = [];
  await new Promise((res, rej) => {
    const d = createDeflate({ level: 9 });
    d.on('data', c => chunks.push(c));
    d.on('end', res); d.on('error', rej);
    d.end(raw);
  });
  const idat = Buffer.concat(chunks);
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const out = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
  await import('fs/promises').then(f => f.writeFile(filepath, out));
}

// ── Pixel helpers ────────────────────────────────────────────────────────────
const W = [255,255,255,210];
const T = [0,0,0,0];
function hex(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
const circle  = (x,y,cx,cy,r) => (x-cx)**2+(y-cy)**2 <= r*r;
const ring    = (x,y,cx,cy,r,s=2) => { const d=Math.hypot(x-cx,y-cy); return d>=r-s && d<=r; };
const rectF   = (x,y,x1,y1,x2,y2) => x>=x1&&x<=x2&&y>=y1&&y<=y2;
const rectS   = (x,y,x1,y1,x2,y2,s=2) => rectF(x,y,x1,y1,x2,y2)&&(x<=x1+s||x>=x2-s||y<=y1+s||y>=y2-s);
const lineH   = (x,y,xa,xb,ly,t=1) => x>=xa&&x<=xb&&Math.abs(y-ly)<=t;
const lineV   = (x,y,lx,ya,yb,t=1) => Math.abs(x-lx)<=t&&y>=ya&&y<=yb;
const rounded = (x,y,s,r=10) => {
  if (x<r&&y<r) return Math.hypot(x-r,y-r)<=r;
  if (x>s-1-r&&y<r) return Math.hypot(x-(s-1-r),y-r)<=r;
  if (x<r&&y>s-1-r) return Math.hypot(x-r,y-(s-1-r))<=r;
  if (x>s-1-r&&y>s-1-r) return Math.hypot(x-(s-1-r),y-(s-1-r))<=r;
  return true;
};

async function makeIcon(name, bgHex, drawFn, size=64) {
  const bg = [...hex(bgHex), 255];
  const pixels = [];
  for (let y=0; y<size; y++) for (let x=0; x<size; x++) {
    if (!rounded(x,y,size)) { pixels.push(T); continue; }
    pixels.push(drawFn(x,y,size) ? W : bg);
  }
  await writePNG(path.join(OUT_DIR, name), pixels, size, size);
  console.log('  ' + name);
}

// ── Icon definitions ─────────────────────────────────────────────────────────
const icons = [
  // Categories
  ['trays.png',              '#8B6343', (x,y)=> rectS(x,y,14,20,50,42)||lineH(x,y,14,50,31)],
  ['kitchen-dining.png',     '#C97C2E', (x,y)=> ring(x,y,32,30,12)||lineV(x,y,32,10,18)],
  ['storage-organizers.png', '#6B4F3A', (x,y)=> rectS(x,y,13,16,51,26)||rectS(x,y,13,30,51,42)],
  ['furniture.png',          '#607080', (x,y)=> rectF(x,y,13,36,51,43)||rectF(x,y,13,23,27,35)||rectF(x,y,37,23,51,35)],
  ['decor.png',              '#3A8A7A', (x,y)=> ring(x,y,32,28,11)||lineV(x,y,32,14,17)||lineH(x,y,31,33,28)],
  // Pages
  ['hero-wood.png',   '#8B6343', (x,y)=> rectS(x,y,12,18,52,42)||lineH(x,y,12,52,30)],
  ['about-hero.png',  '#6B4F3A', (x,y)=> ring(x,y,32,22,10)||(y>=30&&y<=44&&Math.abs(x-32)<=(y-30)*0.9+9&&y<=44)],
  ['contact-hero.png','#25D366', (x,y)=> rectS(x,y,14,14,50,38)||(y>=36&&y<=44&&x>=22&&x<=34&&y-36>=Math.abs(x-28))],
  // Trust
  ['trust-wood.png',     '#8B6343', (x,y)=> rectS(x,y,14,19,50,41)||lineH(x,y,14,50,30)],
  ['trust-handmade.png', '#6B4F3A', (x,y)=> rectS(x,y,22,28,42,44)||rectS(x,y,24,18,28,30)||rectS(x,y,30,16,34,28)||rectS(x,y,36,18,40,28)],
  ['trust-tanzania.png', '#4A7CA5', (x,y)=> ring(x,y,32,30,13)||lineH(x,y,19,45,30)||lineV(x,y,32,17,43)],
  ['trust-whatsapp.png', '#25D366', (x,y)=> ring(x,y,32,30,13)||circle(x,y,32,30,5)],
  // Steps
  ['step-browse.png',   '#8B6343', (x,y)=> rectS(x,y,16,16,48,40)||lineH(x,y,20,44,23)||lineH(x,y,20,44,29)||lineH(x,y,20,40,35)],
  ['step-whatsapp.png', '#25D366', (x,y)=> ring(x,y,32,29,12)],
  ['step-delivery.png', '#C97C2E', (x,y)=> rectS(x,y,10,24,38,42)||rectS(x,y,38,28,54,42)||ring(x,y,18,44,5)||ring(x,y,44,44,5)],
  // Values
  ['value-handmade.png', '#6B4F3A', (x,y)=> rectS(x,y,22,28,42,44)||rectS(x,y,24,18,28,30)||rectS(x,y,30,16,34,28)||rectS(x,y,36,18,40,28)],
  ['value-wood.png',     '#8B6343', (x,y)=> rectS(x,y,12,20,52,44)||lineV(x,y,22,20,44)||lineV(x,y,32,20,44)||lineV(x,y,42,20,44)],
  ['value-care.png',     '#B05050', (x,y)=> circle(x,y,24,26,9)||circle(x,y,40,26,9)||(y>=26&&y<=46&&Math.abs(x-32)<=(46-y)*0.7)],
  // Contact
  ['contact-phone.png',    '#25D366', (x,y)=> rectS(x,y,20,12,44,52)||circle(x,y,32,46,2)],
  ['contact-location.png', '#B05050', (x,y)=> ring(x,y,32,24,10)||(y>=24&&y<=50&&Math.abs(x-32)<=(50-y)*0.4+1)],
  ['contact-hours.png',    '#4A7CA5', (x,y)=> ring(x,y,32,30,13)||lineV(x,y,32,22,30)||lineH(x,y,32,38,33)],
  // Stats
  ['stat-products.png',   '#8B6343', (x,y)=> rectS(x,y,12,20,28,42)||rectS(x,y,32,26,52,42)],
  ['stat-featured.png',   '#C97C2E', (x,y)=> [0,1,2,3,4].some(i=>circle(x,y,32+Math.round(14*Math.sin(i*1.2566)),32-Math.round(14*Math.cos(i*1.2566)),5))||circle(x,y,32,32,6)],
  ['stat-categories.png', '#3A8A7A', (x,y)=> rectS(x,y,12,12,28,28)||rectS(x,y,36,12,52,28)||rectS(x,y,12,36,28,52)||rectS(x,y,36,36,52,52)],
  ['stat-catalog.png',    '#607080', (x,y)=> rectS(x,y,14,12,50,52)||lineH(x,y,20,44,20)||lineH(x,y,20,44,28)||lineH(x,y,20,40,36)],
  // UI
  ['placeholder-product.png', '#6B4F3A', (x,y)=> rectS(x,y,14,12,50,46)||lineH(x,y,14,50,32)||ring(x,y,24,22,6)],
  ['empty-wood.png',           '#8B6343', (x,y)=> rectS(x,y,12,18,52,46)&&((x+y)%8<4)],
];

console.log(`Generating ${icons.length} icons into ${OUT_DIR}/`);
for (const [name, bg, fn] of icons) await makeIcon(name, bg, fn);
console.log('Done!');
