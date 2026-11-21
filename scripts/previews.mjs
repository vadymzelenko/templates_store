// Обложки карточек: первый экран (public/previews/<slug>.jpg) и длинный скриншот для прокрутки при наведении
// (public/previews/tall/<slug>.jpg). Запуск: `npm run dev`, затем `npm run previews -- http://localhost:3000`.
//   --missing        снять только карточки, у которых ещё нет обложки
//   slug1 slug2 …    снять только перечисленные карточки
// На GitHub это делает workflow .github/workflows/previews.yml (Actions → Previews → Run workflow).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { templates } from '../lib/templates.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const base = args.find((a) => /^https?:\/\//.test(a)) || 'http://localhost:3000';
const onlyMissing = args.includes('--missing');
const only = new Set(args.filter((a) => !a.startsWith('-') && !/^https?:\/\//.test(a)));
const out = path.resolve('public/previews');
fs.mkdirSync(path.join(out, 'tall'), { recursive: true });

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
for (const t of templates) {
  if (!t.liveDemoUrl.startsWith('/')) { console.log(`skip ${t.slug}`); continue; }
  if (only.size && !only.has(t.slug)) continue;
  const cover = t.coverImage.startsWith('/previews/') ? path.join(out, path.basename(t.coverImage)) : null;
  const tall = path.join(out, 'tall', `${t.slug}.jpg`);
  // В режиме --missing существующие файлы не перезаписываются.
  const needCover = cover && !(onlyMissing && fs.existsSync(cover));
  const needTall = !(onlyMissing && fs.existsSync(tall));
  if (!needCover && !needTall) continue;
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  await page.goto(base + t.liveDemoUrl, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
  await page.addStyleTag({ content: '.demo-bar, nextjs-portal { display:none !important; } *, *::before, *::after { animation-play-state:paused !important; transition:none !important; }' });
  // прокрутить вниз и обратно, чтобы сработали анимации появления
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  if (needCover) await page.screenshot({ path: cover, type: 'jpeg', quality: 78 });
  const h = Math.min(2600, await page.evaluate(() => document.documentElement.scrollHeight));
  if (needTall) await page.screenshot({ path: tall, type: 'jpeg', quality: 62, clip: { x: 0, y: 0, width: 1280, height: h }, fullPage: true });
  console.log(`ok ${t.slug}`);
  await page.close();
}
await browser.close();
