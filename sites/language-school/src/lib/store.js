import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';

// Простое файловое хранилище: content/site.json (правки из админки) поверх content/site.default.json.
// Работает на любом Node-сервере (`next start`, VPS, Docker с томом на content/).
const DIR = process.env.CONTENT_DIR || path.join(process.cwd(), 'content');
const DEFAULTS = path.join(process.cwd(), 'content', 'site.default.json');
const CONTENT = path.join(DIR, 'site.json');
const LEADS = path.join(DIR, 'leads.json');

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return fallback;
    throw e;
  }
}

// Запись через временный файл, чтобы при сбое не остался обрезанный JSON.
async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  await fs.rename(tmp, file);
}

// Последовательная очередь записей, чтобы два сохранения не перетёрли друг друга.
let queue = Promise.resolve();
function serial(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export async function getContent() {
  const defaults = await readJson(DEFAULTS, {});
  const saved = await readJson(CONTENT, {});
  return { ...defaults, ...saved, site: { ...defaults.site, ...saved.site } };
}

export function saveSection(key, value) {
  return serial(async () => {
    const saved = await readJson(CONTENT, {});
    saved[key] = value;
    await writeJson(CONTENT, saved);
  });
}

export function resetSection(key) {
  return serial(async () => {
    const saved = await readJson(CONTENT, {});
    delete saved[key];
    await writeJson(CONTENT, saved);
  });
}

export async function getLeads() {
  return readJson(LEADS, []);
}

export function addLead(lead) {
  return serial(async () => {
    const leads = await readJson(LEADS, []);
    leads.unshift(lead);
    await writeJson(LEADS, leads.slice(0, 5000));
  });
}

export function updateLead(id, patch) {
  return serial(async () => {
    const leads = await readJson(LEADS, []);
    const i = leads.findIndex((l) => l.id === id);
    if (i === -1) return;
    leads[i] = { ...leads[i], ...patch, id };
    await writeJson(LEADS, leads);
  });
}

export function deleteLead(id) {
  return serial(async () => {
    const leads = await readJson(LEADS, []);
    await writeJson(
      LEADS,
      leads.filter((l) => l.id !== id)
    );
  });
}
