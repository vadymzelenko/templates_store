// Снимает превью для карточек каталога: public/previews/<slug>.jpg
// Запуск: сначала `npm run dev` (или start), затем `npm run previews [-- http://localhost:3000]`.
// Внешний проект можно снять с другого адреса: EXTERNAL_language-school=http://localhost:3200
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { projects } from '../store/catalog.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const out = path.resolve('public/previews');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const p of projects) {
  const url = p.external ? process.env[`EXTERNAL_${p.slug}`] : base + p.href;
  if (!url) { console.log(`skip ${p.slug} (нет адреса)`); continue; }
  const page = await browser.newPage({ viewport: { width: 1280, height: 880 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.addStyleTag({ content: '.demo-bar, nextjs-portal { display:none !important; } *, *::before { animation-duration:0s !important; transition:none !important; }' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, `${p.slug}.jpg`), type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1280, height: 2200 }, fullPage: true });
  console.log(`ok ${p.slug}`);
  await page.close();
}
await browser.close();
