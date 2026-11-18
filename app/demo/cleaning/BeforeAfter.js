'use client';
// Слайдер «до/после» по нарисованной комнате: тянем ручку — грязь стирается
import { useState } from 'react';

function Room({ dirty }) {
  return (
    <svg viewBox="0 0 600 380" className="cl-room" aria-hidden="true">
      <rect width="600" height="380" fill={dirty ? '#d8d1c2' : '#e8f6fb'} />
      <rect y="290" width="600" height="90" fill={dirty ? '#a99a83' : '#f6d9a8'} />
      {/* окно */}
      <rect x="380" y="50" width="150" height="130" fill={dirty ? '#b9b6a8' : '#bfe9ff'} stroke="#1a2b3c" strokeWidth="6" />
      <path d="M455 50v130M380 115h150" stroke="#1a2b3c" strokeWidth="5" />
      {/* диван */}
      <rect x="60" y="190" width="250" height="90" rx="18" fill={dirty ? '#7f7a8c' : '#4f7cff'} />
      <rect x="45" y="170" width="40" height="120" rx="14" fill={dirty ? '#6e6a7a' : '#3a66e8'} />
      <rect x="285" y="170" width="40" height="120" rx="14" fill={dirty ? '#6e6a7a' : '#3a66e8'} />
      <rect x="80" y="150" width="210" height="60" rx="16" fill={dirty ? '#8b8698' : '#6a90ff'} />
      {/* столик и растение */}
      <rect x="350" y="250" width="120" height="14" rx="4" fill="#1a2b3c" /><path d="M362 264v30M458 264v30" stroke="#1a2b3c" strokeWidth="6" />
      <path d="M540 290v-30h30v30z" fill="#e2725b" />
      <path d="M555 260c-20-30-10-60 0-70 10 10 20 40 0 70z" fill={dirty ? '#8d9a6a' : '#3fbf7f'} />
      {dirty ? (
        <g>
          {/* пыль, пятна, носки, крошки */}
          <ellipse cx="160" cy="320" rx="60" ry="10" fill="#6c5f4c" opacity=".5" />
          <ellipse cx="420" cy="335" rx="36" ry="8" fill="#6c5f4c" opacity=".45" />
          <path d="M120 300c10-4 20 0 22 8l-4 10c-8-2-14-2-20 2l-6-6c2-6 4-10 8-14z" fill="#f2f2f2" stroke="#999" />
          <path d="M470 312c8-6 18-2 20 6l-2 10c-8-2-12 0-18 4l-6-8c2-6 2-8 6-12z" fill="#f4a2a2" />
          {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={(i * 97) % 600} cy={300 + ((i * 37) % 70)} r={2 + (i % 3)} fill="#5c4e3a" opacity=".6" />)}
          {Array.from({ length: 14 }, (_, i) => <circle key={`d${i}`} cx={390 + ((i * 29) % 140)} cy={60 + ((i * 41) % 110)} r={4 + (i % 4)} fill="#8a8572" opacity=".5" />)}
          <path d="M300 255l40 -6 4 10-40 6z" fill="#e8d06a" opacity=".8" />
        </g>
      ) : (
        <g fill="#fff" stroke="#1a2b3c" strokeWidth="2.5">
          {[[420, 90], [500, 150], [180, 140], [440, 245], [100, 315]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 14}l4 10 10 4-10 4-4 10-4-10-10-4 10-4z`} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default function BeforeAfter() {
  const [x, setX] = useState(38);
  return (
    <div className="cl-ba">
      <Room dirty={false} />
      <div className="cl-ba-dirty" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}><Room dirty /></div>
      <div className="cl-ba-handle" style={{ left: `${x}%` }} aria-hidden="true"><span>⟷</span></div>
      <span className="cl-ba-tag l">до</span><span className="cl-ba-tag r">после</span>
      <input type="range" min="0" max="100" value={x} onChange={(e) => setX(+e.target.value)} aria-label="Сравнить до и после уборки" />
    </div>
  );
}
