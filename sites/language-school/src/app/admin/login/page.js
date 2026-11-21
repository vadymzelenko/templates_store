import { redirect } from 'next/navigation';
import { isAdmin, adminConfigured } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  return (
    <main className="adm-login">
      <div className="adm-login__box">
        <p className="adm-login__mark">Вылет</p>
        <h1>Панель управления</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="adm-error">Вход закрыт: задайте ADMIN_PASSWORD в переменных окружения сервера и перезапустите сайт.</p>
        )}
      </div>
    </main>
  );
}
