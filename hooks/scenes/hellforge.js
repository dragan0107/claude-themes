// Hellforge: black basalt cliffs, pulsing lava cracks and embers rising from a forge.

// A small fixed-seed generator, so the embers land the same on every reload.
let seed = 1337

function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}

function embers(count) {
  let out = ''

  for (let i = 0; i < count; i++) {
    const x = Math.round(rnd() * 1600)
    const r = (1 + rnd() * 2.6).toFixed(1)
    const duration = (7 + rnd() * 11).toFixed(1)
    const delay = (-rnd() * 18).toFixed(1)
    const fill = rnd() > 0.35 ? '#ff7a2a' : '#ffd27a'

    out += `<circle class="e e${i % 3}" cx="${x}" cy="1010" r="${r}" fill="${fill}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
  }

  return out
}

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#050303"/>
    <stop offset="0.55" stop-color="#0d0605"/>
    <stop offset="0.85" stop-color="#2a0c05"/>
    <stop offset="1" stop-color="#5a1604"/>
  </linearGradient>
  <radialGradient id="forge" cx="0.5" cy="1" r="0.75">
    <stop offset="0" stop-color="#ff5a1f" stop-opacity="0.55"/>
    <stop offset="0.4" stop-color="#c81e0a" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="lava" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff2d0a"/>
    <stop offset="0.5" stop-color="#ffb347"/>
    <stop offset="1" stop-color="#ff3d0a"/>
  </linearGradient>
  <filter id="glow" x="-20%" y="-200%" width="140%" height="500%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>
<style>
  .heat { animation: heat 6s ease-in-out infinite; transform-origin: 800px 1000px; }
  .crack { fill: none; stroke: url(#lava); stroke-linecap: round; stroke-linejoin: round; animation: pulse 4.5s ease-in-out infinite; }
  .crack.b { animation-duration: 6.5s; animation-delay: -2s; }
  .crack.c { animation-duration: 3.6s; animation-delay: -1s; }
  .rim { fill: none; stroke: #ff4a12; stroke-width: 2; opacity: 0.5; animation: pulse 5s ease-in-out infinite; }
  .e { opacity: 0; animation-name: rise0; animation-timing-function: linear; animation-iteration-count: infinite; }
  .e1 { animation-name: rise1; }
  .e2 { animation-name: rise2; }
  @keyframes heat { 0%,100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes pulse { 0%,100% { opacity: 0.55; } 45% { opacity: 1; } 60% { opacity: 0.8; } }
  @keyframes rise0 { 0% { transform: translate(0,0); opacity: 0; } 8% { opacity: 1; } 70% { opacity: 0.7; } 100% { transform: translate(60px,-980px); opacity: 0; } }
  @keyframes rise1 { 0% { transform: translate(0,0); opacity: 0; } 10% { opacity: 0.9; } 60% { opacity: 0.5; } 100% { transform: translate(-90px,-760px); opacity: 0; } }
  @keyframes rise2 { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: 1; } 50% { transform: translate(40px,-420px); opacity: 0.8; } 100% { transform: translate(-30px,-860px); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .e, .heat, .crack, .rim { animation: none; } .e { opacity: 0; } }
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<rect class="heat" width="1600" height="1000" fill="url(#forge)"/>
<g opacity="0.9">
  <polygon points="0,1000 0,430 70,380 120,470 180,410 235,560 300,520 345,690 430,740 470,1000" fill="#040202"/>
  <polyline class="rim" points="0,430 70,380 120,470 180,410 235,560 300,520 345,690 430,740 470,1000"/>
  <polygon points="1600,1000 1600,360 1540,330 1490,450 1420,400 1375,580 1300,560 1260,720 1170,770 1130,1000" fill="#040202"/>
  <polyline class="rim" points="1600,360 1540,330 1490,450 1420,400 1375,580 1300,560 1260,720 1170,770 1130,1000"/>
  <polygon points="620,1000 660,900 720,930 790,870 860,925 930,890 990,1000" fill="#060303"/>
</g>
<g filter="url(#glow)">
  <path class="crack" stroke-width="5" d="M40 960 L130 905 L175 940 L260 860 L300 900 L345 800"/>
  <path class="crack b" stroke-width="3.5" d="M130 905 L110 820 L160 760 L140 690"/>
  <path class="crack c" stroke-width="3" d="M260 860 L235 770 L270 700"/>
  <path class="crack b" stroke-width="5" d="M1560 955 L1470 890 L1430 930 L1350 840 L1310 880 L1270 790"/>
  <path class="crack" stroke-width="3.5" d="M1470 890 L1500 800 L1450 730 L1480 640"/>
  <path class="crack c" stroke-width="3" d="M1350 840 L1385 750 L1360 690"/>
  <path class="crack c" stroke-width="6" d="M430 985 L560 965 L640 990 L780 960 L900 988 L1030 962 L1170 985"/>
</g>
<g filter="url(#soft)">${embers(54)}</g>
</svg>`
