import { randomUUID } from 'crypto';
import { addLead } from '@/lib/store';
import { languages } from '@/data/site';

export const dynamic = 'force-dynamic';

// Не больше 5 заявок с одного адреса за 10 минут.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
const TIMES = { morning: 'утром', day: 'днём', evening: 'вечером' };

async function notify(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const lang = languages.find((l) => l.code === lead.lang)?.name || 'не выбран';
  const text = [
    'Новая заявка с сайта',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Язык: ${lang}`,
    lead.time ? `Позвонить: ${TIMES[lead.time] || lead.time}` : null,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
  ]
    .filter(Boolean)
    .join('\n');
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Уведомление необязательно: заявка уже сохранена.
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Неверный запрос' }, { status: 400 });
  }

  // Бот заполнил скрытое поле — делаем вид, что всё хорошо.
  if (body.website) return Response.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  if (limited(ip)) return Response.json({ error: 'Слишком много заявок, попробуйте позже' }, { status: 429 });

  const name = clean(body.name, 60);
  const phone = clean(body.phone, 30);
  const digits = phone.replace(/\D/g, '');
  if (!name) return Response.json({ error: 'Укажите имя' }, { status: 400 });
  if (digits.length < 10 || digits.length > 15) return Response.json({ error: 'Проверьте номер телефона' }, { status: 400 });
  if (body.agree !== true) return Response.json({ error: 'Нужно согласие на обработку данных' }, { status: 400 });

  const lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    lang: languages.some((l) => l.code === body.lang) ? body.lang : '',
    time: TIMES[body.time] ? body.time : '',
    comment: clean(body.comment, 500),
    source: clean(body.source, 40),
    status: 'new',
    note: '',
  };

  try {
    await addLead(lead);
  } catch (e) {
    console.error('lead save failed', e);
    return Response.json({ error: 'Не получилось сохранить заявку' }, { status: 500 });
  }
  await notify(lead);
  return Response.json({ ok: true });
}
