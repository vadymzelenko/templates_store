'use client';
import { useState } from 'react';

const data = {
  'Кошки': [['Приём терапевта', '450'], ['Комплексная вакцинация', '650'], ['Стерилизация', '2 400'], ['Чистка зубов ультразвуком', '1 800'], ['Анализ крови', '520']],
  'Собаки': [['Приём терапевта', '450'], ['Вакцинация + бешенство', '750'], ['Кастрация, до 20 кг', '2 800'], ['Обработка от клещей', '250'], ['УЗИ брюшной полости', '700']],
  'Грызуны и кролики': [['Приём экзотолога', '500'], ['Подрезка зубов', '400'], ['Вакцинация кролика', '450'], ['Стерилизация кролика', '2 000']],
  'Птицы': [['Приём экзотолога', '500'], ['Подрезка клюва и когтей', '300'], ['Анализ помёта', '350']],
};

export default function Services() {
  const kinds = Object.keys(data);
  const [k, setK] = useState(kinds[0]);
  return (
    <div className="vt-srv">
      <div className="vt-kinds" role="tablist">
        {kinds.map((x) => <button key={x} type="button" role="tab" aria-selected={k === x} onClick={() => setK(x)}>{x}</button>)}
      </div>
      <ul className="vt-list">
        {data[k].map(([n, p]) => <li key={n}><span>{n}</span><b>{p} ₴</b></li>)}
      </ul>
    </div>
  );
}
