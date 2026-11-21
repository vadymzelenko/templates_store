// Builds the standalone Next.js landings from sites/<slug> as static exports
// and places them into public/projects/<slug>, where the store serves them.
//
//   npm run sites:build                 build every site
//   npm run sites:build -- stille       build selected sites
//
// Each site is built in a temporary copy, so server-only parts that cannot be
// exported (an admin panel, API routes) are removed from the copy, never from sites/.

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const SITES = {
  'enigma-photo': {},
  'language-school': { strip: ['src/app/admin', 'src/app/api', 'src/app/robots.js', 'src/app/sitemap.js'] },
  'vibe-bistro': {},
  stille: {},
};

const selected = process.argv.slice(2);
const targets = selected.length ? selected : Object.keys(SITES);

for (const slug of targets) {
  const site = SITES[slug];
  if (!site) {
    console.error(`Unknown site "${slug}". Available: ${Object.keys(SITES).join(', ')}`);
    process.exit(1);
  }

  const src = path.join(root, 'sites', slug);
  const out = path.join(root, 'public', 'projects', slug);
  const work = mkdtempSync(path.join(tmpdir(), `site-${slug}-`));

  console.log(`\n> ${slug}`);
  cpSync(src, work, {
    recursive: true,
    filter: (p) => !/[\\/](node_modules|\.next|out)([\\/]|$)/.test(p.slice(src.length)),
  });
  for (const rel of site.strip ?? []) rmSync(path.join(work, rel), { recursive: true, force: true });

  const run = (cmd, env = {}) =>
    execSync(cmd, { cwd: work, stdio: 'inherit', env: { ...process.env, ...env } });

  // Hosting providers (Vercel) build with NODE_ENV=production, which would make npm skip
  // devDependencies such as Tailwind and PostCSS that the sites need to build.
  const install = existsSync(path.join(work, 'package-lock.json')) ? 'npm ci' : 'npm install';
  run(`${install} --include=dev --no-audit --no-fund`, { NODE_ENV: 'development' });
  run(`npx next build ${process.env.NEXT_BUILD_FLAGS || ''}`.trim(), {
    STATIC_EXPORT: '1',
    BASE_PATH: `/projects/${slug}`,
    NEXT_TELEMETRY_DISABLED: '1',
  });

  rmSync(out, { recursive: true, force: true });
  cpSync(path.join(work, 'out'), out, { recursive: true });
  rmSync(work, { recursive: true, force: true });
  console.log(`  done: public/projects/${slug}/index.html`);
}
