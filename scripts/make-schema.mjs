// npm run db:sql  ->  збирає supabase/schema.sql = db/base.sql + view і індекси з business/fields.js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fields } from '../business/fields.js';

const COLS = { email: 'client_email', name: 'client_name', date: 'slot_date', time: 'slot_time', resource: 'resource' };
const RESERVED = new Set(['id', 'status', 'created_at', 'updated_at']);
const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

const keys = new Set();
for (const f of fields) {
  if (!/^[a-z][a-z0-9_]*$/i.test(f.key)) throw new Error(`Поле "${f.key}": key лише латиницею, цифри й _`);
  if (RESERVED.has(f.key)) throw new Error(`Поле "${f.key}": ключ зарезервовано`);
  if (keys.has(f.key)) throw new Error(`Дубль key: ${f.key}`);
  keys.add(f.key);
  if (f.column && !COLS[f.column]) throw new Error(`Поле "${f.key}": невідомий column "${f.column}"`);
}
const used = fields.filter((f) => f.column).map((f) => f.column);
if (used.filter((c) => c === 'email').length !== 1) throw new Error('Потрібне рівно одне поле з column: "email"');
if (new Set(used).size !== used.length) throw new Error('Кожен column можна використати лише раз');

const select = fields.map((f) =>
  f.column ? `  ${COLS[f.column]} as ${q(f.key)}` : `  data->>${lit(f.key)} as ${q(f.key)}`);

const indexes = fields.filter((f) => f.index && !f.column).map((f) =>
  `create index if not exists ${q(`bookings_data_${f.key}_idx`)} on bookings ((data->>${lit(f.key)}));`);

const generated = `
-- ===== Згенеровано з business/fields.js (npm run db:sql). Руками не редагувати. =====
${indexes.join('\n')}

-- Зручний вигляд для Table Editor: кожне поле форми окремою колонкою.
drop view if exists bookings_readable;
create view bookings_readable with (security_invoker = true) as
select
  id, status, created_at,
${select.join(',\n')}
from bookings;

-- View не має віддаватись через публічний API
revoke all on bookings_readable from anon, authenticated;
`;

mkdirSync('supabase', { recursive: true });
writeFileSync('supabase/schema.sql', readFileSync('db/base.sql', 'utf8') + generated);
console.log(`supabase/schema.sql готово: ${fields.length} полів, ${indexes.length} індекс(ів)`);
