// НЕ РЕДАГУВАТИ. Збирає конфіг із папки business/ — усе, що змінюється під нішу, лежить там.
import { brand, theme } from './business/theme.js';
import { timezone, slots, uniqueSlot, pendingHoldMinutes, clientEditable, statuses } from './business/rules.js';
import { fields, adminColumns } from './business/fields.js';
import { texts, emails } from './business/texts.js';
import { landing, formats } from './business/landing.js';

const config = {
  brand, theme, timezone, slots, uniqueSlot, pendingHoldMinutes, clientEditable, statuses,
  fields, adminColumns, texts, emails, landing, formats,
};

export default config;
