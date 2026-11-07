export default function Background({ dim }: { dim: boolean }) {
  return (
    <svg className={'bg' + (dim ? ' dim' : '')} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className="ga0" /><stop offset=".6" className="ga1" /><stop offset="1" className="ga2" /></linearGradient>
        <linearGradient id="gB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" className="ga0" /><stop offset=".55" className="ga1" /><stop offset="1" className="ga2" /></linearGradient>
        <linearGradient id="gF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className="gf0" /><stop offset="1" className="gf1" /></linearGradient>
        <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path className="gridline" d="M64 0H0V64" /></pattern>
        <radialGradient id="fade" cx=".78" cy=".3" r=".65"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
        <mask id="gm"><rect width="1600" height="900" fill="url(#fade)" /></mask>
      </defs>
      <rect width="1600" height="900" fill="url(#grid)" mask="url(#gm)" />
      <g transform="translate(1190 330) rotate(16)" fill="none" stroke="url(#gA)" strokeWidth="1.2">
        <rect x="-60" y="-60" width="120" height="120" opacity=".95" />
        <rect x="-105" y="-105" width="210" height="210" opacity=".75" />
        <rect x="-150" y="-150" width="300" height="300" opacity=".55" />
        <rect x="-195" y="-195" width="390" height="390" opacity=".38" />
        <rect x="-240" y="-240" width="480" height="480" opacity=".24" />
      </g>
      <polygon points="-20,540 430,540 510,620 510,930 -20,930" fill="url(#gF)" stroke="url(#gB)" strokeWidth="1.2" />
      <g transform="translate(250 120) rotate(-11)"><rect x="-150" y="-70" width="300" height="140" fill="none" stroke="url(#gB)" strokeWidth="1.2" opacity=".8" /></g>
      <polygon points="120,200 560,200 520,216 80,216" className="p-fill" opacity=".35" />
      <path className="p-line" opacity=".3" d="M700 900 L1100 500 M740 900 L1140 500 M780 900 L1180 500 M820 900 L1220 500 M860 900 L1260 500" />
      <path className="p-line" opacity=".7" strokeWidth="2" d="M40 104V40H104 M1496 40H1560V104 M40 796V860H104 M1496 860H1560V796" />
    </svg>
  )
}
