// ЛОГІКА записів: час, слоти, статуси, права клієнта.
export const timezone = 'Europe/Kyiv';

export const slots = {
  start: '10:00',
  end: '20:00',
  stepMinutes: 60,
  daysAhead: 60,
  closedWeekdays: [], // 0 = неділя ... 6 = субота
};

export const uniqueSlot = true;          // true: один слот = один клієнт (false: можна багато одночасно)
export const pendingHoldMinutes = 30;    // скільки непідтверджений запис тримає слот
export const clientEditable = ['confirmed']; // у яких статусах клієнт може змінити/видалити запис

// pending / confirmed / cancelled потрібні рушію, решту можна додавати
export const statuses = {
  pending:   { label: 'Очікує підтвердження', color: '#9a6b00' },
  confirmed: { label: 'Підтверджено',         color: '#1d7a46' },
  done:      { label: 'Виконано',             color: '#55606b' },
  cancelled: { label: 'Скасовано',            color: '#b03a2e' },
};
