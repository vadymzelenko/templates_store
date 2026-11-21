'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="adm-login__form">
      <label className="adm-field">
        <span>Пароль</span>
        <input type="password" name="password" autoComplete="current-password" autoFocus required />
      </label>
      {state?.error && <p className="adm-error">{state.error}</p>}
      <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
        {pending ? 'Проверяем…' : 'Войти'}
      </button>
    </form>
  );
}
