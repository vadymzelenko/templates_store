import { createClient } from '@supabase/supabase-js';

let client;
// Серверний клієнт (service_role). Ніколи не імпортувати з client-компонентів.
export function db() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}
