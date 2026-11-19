'use client';
// Фото с ленивой загрузкой. Если картинка не загрузилась — вместо битой иконки остаётся спокойный фон.
import { useState } from 'react';
import { unsplash } from '@/lib/photos';

export default function Photo({ id, src, alt = '', w = 1200, className = '', style, fallback = '#ddd', ...rest }) {
  const [broken, setBroken] = useState(false);
  const url = src || unsplash(id, w);
  if (broken) return <span role="img" aria-label={alt} className={className} style={{ display: 'block', background: fallback, ...style }} />;
  return <img src={url} alt={alt} loading="lazy" decoding="async" className={className} style={{ color: 'transparent', background: fallback, ...style }} onError={() => setBroken(true)} {...rest} />;
}
