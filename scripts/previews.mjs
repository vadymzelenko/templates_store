// Обложки карточек: первый экран (public/previews/<slug>.jpg) и длинный скриншот для прокрутки при наведении
// (public/previews/tall/<slug>.jpg). Запуск: `npm run dev`, затем `npm run previews -- http://localhost:3000`.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { templates } from '../lib/templates.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const out = path.resolve('public/previews');
fs.mkdirSync(path.join(out, 'tall'), { recursive: true });

const browser = await chromium.launch();
for (const t of templates) {
  if (!t.liveDemoUrl.startsWith('/')) { console.log(`skip ${t.slug}`); continue; }
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  await page.goto(base + t.liveDemoUrl, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
  await page.addStyleTag({ content: '.demo-bar, nextjs-portal { display:none !important; } *, *::before, *::after { animation-play-state:paused !important; transition:none !important; }' });
  // прокрутить вниз и обратно, чтобы сработали анимации появления
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  if (t.coverImage.startsWith('/previews/')) await page.screenshot({ path: path.join(out, path.basename(t.coverImage)), type: 'jpeg', quality: 78 });
  const h = Math.min(2600, await page.evaluate(() => document.documentElement.scrollHeight));
  await page.screenshot({ path: path.join(out, 'tall', `${t.slug}.jpg`), type: 'jpeg', quality: 62, clip: { x: 0, y: 0, width: 1280, height: h }, fullPage: true });
  console.log(`ok ${t.slug}`);
  await page.close();
}
await browser.close();
