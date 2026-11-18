// Подключён ли движок: без базы и секрета форма не падает, а предлагает написать в Telegram.
export const engineReady = () =>
  !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.JWT_SECRET);
