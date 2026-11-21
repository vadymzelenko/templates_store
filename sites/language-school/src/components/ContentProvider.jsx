'use client';

import { createContext, useContext } from 'react';

const Ctx = createContext(null);

export function ContentProvider({ value, children }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useContent вне ContentProvider');
  return c;
}
