'use client';
// Пошаговая форма: один вопрос на экране, шаги перелистываются сами после выбора.
// steps: [{ key, title, render: ({ next }) => JSX, valid?: () => bool }]
import { useEffect, useRef, useState } from 'react';

export default function Stepper({ steps, className = '', onFinish, finishText = 'Отправить', labels = {}, start = 0 }) {
  const [i, setI] = useState(start);
  const last = i === steps.length - 1;
  const step = steps[i];
  const next = () => setI((v) => Math.min(steps.length - 1, v + 1));
  const back = () => setI((v) => Math.max(0, v - 1));
  const can = step.valid ? step.valid() : true;
  // высота окна подстраивается под текущий шаг, а не под самый высокий
  const refs = useRef([]);
  const [h, setH] = useState();
  useEffect(() => {
    const el = refs.current[i];
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [i]);

  return (
    <div className={`stp ${className}`}>
      <div className="stp-top">
        <div className="stp-bar" aria-hidden="true"><i style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>
        <span className="stp-count">{labels.step || 'Шаг'} {i + 1} / {steps.length}</span>
      </div>
      <div className="stp-view" style={{ height: h }}>
        <div className="stp-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {steps.map((s, k) => (
            <section key={s.key} ref={(el) => { refs.current[k] = el; }} className="stp-slide" aria-hidden={k !== i} inert={k !== i}>
              <h3 className="stp-title">{s.title}</h3>
              {s.hint && <p className="stp-hint">{s.hint}</p>}
              {s.render({ next })}
            </section>
          ))}
        </div>
      </div>
      <div className="stp-nav">
        <button type="button" className="stp-back" onClick={back} disabled={i === 0}>{labels.back || '← Назад'}</button>
        {last ? (
          <button type="button" className="stp-next" disabled={!can} onClick={onFinish}>{finishText}</button>
        ) : (
          <button type="button" className="stp-next" disabled={!can} onClick={next}>{labels.next || 'Дальше →'}</button>
        )}
      </div>
    </div>
  );
}
