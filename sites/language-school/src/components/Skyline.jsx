// Виды из иллюминатора: плоские силуэты городов-«направлений» в цветах сайта.
// viewBox 300×400, земля начинается на y=300.

const INK = '#050f16';
const WHITE = '#ffffff';

function Cloud({ x, y, s = 1, className = 'cloud' }) {
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="10" width="92" height="22" rx="11" fill={WHITE} />
      <rect x="18" y="0" width="46" height="30" rx="15" fill={WHITE} />
    </g>
  );
}

function Ground({ lights = [] }) {
  return (
    <g>
      <rect x="0" y="300" width="300" height="100" fill={INK} />
      {lights.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="10" height="6" fill="#ff7a1f" />
      ))}
    </g>
  );
}

const lights = [
  [24, 324],
  [62, 352],
  [118, 330],
  [176, 362],
  [214, 336],
  [262, 354],
];

function London() {
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 8);
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ffc69c" />
      <circle cx="210" cy="96" r="34" fill={WHITE} />
      <Cloud x={20} y={70} s={0.9} />
      <Cloud x={170} y={150} s={0.7} />
      <g fill="none" stroke={INK} strokeWidth="5">
        <circle cx="228" cy="210" r="58" />
        {spokes.map((a, i) => (
          <line
            key={i}
            x1={228 + Math.cos(a) * 58}
            y1={210 + Math.sin(a) * 58}
            x2={228 - Math.cos(a) * 58}
            y2={210 - Math.sin(a) * 58}
            strokeWidth="2.5"
          />
        ))}
        <path d="M228 210 L196 300 M228 210 L260 300" />
      </g>
      <circle cx="228" cy="210" r="7" fill={INK} />
      <g fill={INK}>
        <rect x="66" y="112" width="40" height="190" />
        <rect x="60" y="100" width="52" height="20" />
        <polygon points="60,100 86,44 112,100" />
        <rect x="84" y="24" width="4" height="24" />
        <rect x="106" y="236" width="104" height="66" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={108 + i * 15} y="226" width="8" height="12" />
        ))}
      </g>
      <circle cx="86" cy="146" r="13" fill="#ffc69c" />
      <path d="M86 146 L86 137 M86 146 L93 150" stroke={INK} strokeWidth="2.5" />
      <Ground lights={lights} />
    </svg>
  );
}

function Berlin() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ffe2cc" />
      <circle cx="74" cy="92" r="28" fill="#ff7a1f" />
      <Cloud x={150} y={60} s={1} />
      <Cloud x={-20} y={170} s={0.6} />
      <g fill={INK}>
        <rect x="224" y="40" width="4" height="40" />
        <rect x="220" y="76" width="12" height="226" />
        <circle cx="226" cy="150" r="24" />
        <rect x="214" y="176" width="24" height="8" />
        <rect x="34" y="204" width="150" height="24" />
        <rect x="52" y="190" width="114" height="16" />
        <rect x="96" y="168" width="26" height="22" />
        <polygon points="92,190 96,176 122,176 126,190" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={40 + i * 26} y="228" width="11" height="74" />
        ))}
        <rect x="28" y="292" width="162" height="10" />
      </g>
      <Ground lights={lights} />
    </svg>
  );
}

function Madrid() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ff9d57" />
      <circle cx="150" cy="120" r="64" fill="#ffd9bd" />
      <Cloud x={196} y={62} s={0.7} />
      <Cloud x={-12} y={96} s={0.8} />
      <g fill={INK}>
        <polygon points="104,176 150,146 196,176" />
        <rect x="100" y="174" width="100" height="22" />
        <rect x="30" y="196" width="240" height="106" />
      </g>
      <g fill="#ff9d57">
        <path d="M120 302 V244 a30 30 0 0 1 60 0 V302 Z" />
        <path d="M58 302 V254 a20 20 0 0 1 40 0 V302 Z" />
        <path d="M202 302 V254 a20 20 0 0 1 40 0 V302 Z" />
      </g>
      <g fill={WHITE}>
        <rect x="36" y="206" width="6" height="28" />
        <rect x="258" y="206" width="6" height="28" />
      </g>
      <Ground lights={lights} />
    </svg>
  );
}

function Warsaw() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ffd2b0" />
      <circle cx="232" cy="84" r="26" fill={WHITE} />
      <Cloud x={14} y={54} s={0.85} />
      <Cloud x={196} y={160} s={0.6} />
      <g fill={INK}>
        <rect x="148" y="12" width="4" height="40" />
        <polygon points="138,98 150,40 162,98" />
        <rect x="132" y="96" width="36" height="40" />
        <rect x="118" y="134" width="64" height="52" />
        <rect x="96" y="184" width="108" height="60" />
        <rect x="56" y="242" width="188" height="60" />
        <rect x="114" y="124" width="6" height="14" />
        <rect x="180" y="124" width="6" height="14" />
        <rect x="92" y="172" width="6" height="16" />
        <rect x="202" y="172" width="6" height="16" />
      </g>
      <g fill="#ffd2b0">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`a${i}`} x={104 + i * 20} y="196" width="6" height="36" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={`b${i}`} x={68 + i * 22} y="256" width="6" height="34" />
        ))}
      </g>
      <Ground lights={lights} />
    </svg>
  );
}

function Paris() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ffe9da" />
      <circle cx="72" cy="120" r="36" fill="#ff7a1f" />
      <Cloud x={170} y={70} s={0.9} />
      <Cloud x={190} y={190} s={0.5} />
      <g fill={INK}>
        <rect x="148" y="18" width="4" height="30" />
        <path d="M144 48 H156 L164 120 L178 178 L214 302 H186 Q150 248 114 302 H86 L122 178 L136 120 Z" />
      </g>
      <g fill="#ffe9da">
        <rect x="126" y="146" width="48" height="8" />
        <rect x="112" y="200" width="76" height="8" />
        <path d="M144 120 H156 L160 140 H140 Z" />
      </g>
      <Ground lights={lights} />
    </svg>
  );
}

function Beijing() {
  const roof = (y, w, h) => {
    const l = 150 - w / 2;
    return `M${l} ${y + h} Q150 ${y - 6} ${l + w} ${y + h} Z`;
  };
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#ff8a3a" />
      <circle cx="226" cy="90" r="30" fill="#ffe2cc" />
      <Cloud x={6} y={78} s={0.8} />
      <Cloud x={176} y={150} s={0.55} />
      <g fill={INK}>
        <rect x="148" y="122" width="4" height="22" />
        <circle cx="150" cy="140" r="7" />
        <path d={roof(146, 96, 26)} />
        <rect x="122" y="172" width="56" height="22" />
        <path d={roof(186, 128, 28)} />
        <rect x="110" y="214" width="80" height="26" />
        <path d={roof(232, 160, 30)} />
        <rect x="98" y="262" width="104" height="30" />
        <rect x="56" y="290" width="188" height="12" />
      </g>
      <g fill="#ff8a3a">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={110 + i * 22} y="268" width="8" height="22" />
        ))}
      </g>
      <Ground lights={lights} />
    </svg>
  );
}

export const scenes = { en: London, de: Berlin, es: Madrid, pl: Warsaw, fr: Paris, zh: Beijing };

export default function Skyline({ code }) {
  const Scene = scenes[code];
  return Scene ? <Scene /> : null;
}
