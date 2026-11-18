// ЛОГИКА заявок на созвон: время, слоты, статусы, права клиента.
export const timezone = 'Europe/Kyiv';

export const slots = {
  start: '10:00',
  end: '19:00',
  stepMinutes: 30,
  daysAhead: 30,
  closedWeekdays: [0, 6], // 0 = воскресенье ... 6 = суббота
};

export const uniqueSlot = true;          // один слот = один созвон
export const pendingHoldMinutes = 30;    // сколько неподтверждённая заявка держит слот
export const clientEditable = ['confirmed']; // в каких статусах клиент может перенести/удалить заявку

// pending / confirmed / cancelled нужны движку, остальные можно добавлять
export const statuses = {
  pending:   { label: 'Ждёт подтверждения', color: '#9a6b00' },
  confirmed: { label: 'Созвон назначен',     color: '#1d7a46' },
  brief:     { label: 'Бриф получен',        color: '#2c5d8a' },
  work:      { label: 'В работе',            color: '#6a4c93' },
  done:      { label: 'Сайт запущен',        color: '#55606b' },
  cancelled: { label: 'Отменено',            color: '#b03a2e' },
};
