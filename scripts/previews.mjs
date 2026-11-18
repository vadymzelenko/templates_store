// Обложки для карточек: снимает первый экран каждого шаблона с coverImage = /previews/<slug>.jpg
// Запуск: `npm run dev`, затем `npm run previews` (или `npm run previews -- http://localhost:3100`).
// Внешние демо (GitHub и т. п.) пропускаются: их обложку положите в public/previews вручную.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { templates } from '../lib/templates.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const out = path.resolve('public/previews');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const t of templates.filter((x) => x.coverImage.startsWith('/previews/'))) {
  if (!t.liveDemoUrl.startsWith('/')) { console.log(`skip ${t.slug}`); continue; }
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  await page.goto(base + t.liveDemoUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.addStyleTag({ content: '.demo-bar, nextjs-portal { display:none !important; } *, *::before, *::after { animation-play-state:paused !important; transition:none !important; }' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(out, path.basename(t.coverImage)), type: 'jpeg', quality: 78 });
  console.log(`ok ${t.slug}`);
  await page.close();
}
await browser.close();
