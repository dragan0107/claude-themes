// Haki: Conqueror's will. A black-red sky where crimson lightning with black
// cores keeps tearing down while red sparks rise. Kept cheap on purpose: the
// desktop backdrop frame freezes when a frame costs too much (flickering whole
// groups, or wide glow strokes on every bolt), so each line animates on its own.
// Every bolt stays faintly visible between strikes so no frame is ever empty.

let seed = 4242

function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}

/** A jagged line from a to b with a few short forks, as SVG path data. */
function zig(x0, y0, x1, y1, steps, jitter, forks) {
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy)
  const nx = -dy / len
  const ny = dx / len
  let d = `M${x0} ${y0}`
  let extra = ''

  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const off = i === steps ? 0 : (rnd() - 0.5) * 2 * jitter
    const x = Math.round(x0 + dx * t + nx * off)
    const y = Math.round(y0 + dy * t + ny * off)

    d += `L${x} ${y}`

    if (forks > 0 && i < steps - 1 && rnd() < 0.3) {
      const side = rnd() < 0.5 ? -1 : 1
      const reach = len * (0.12 + rnd() * 0.16)
      const ex = x + (dx / len) * reach * 0.7 + nx * side * reach * 0.7
      const ey = y + (dy / len) * reach * 0.7 + ny * side * reach * 0.7

      extra += zig(x, y, Math.round(ex), Math.round(ey), 4, jitter * 0.5, forks - 1)
    }
  }

  return d + extra
}

// [x0, y0, x1, y1, steps, jitter, strike seconds, size]
// Long bolts down both sides and across the top, plus two huge diagonals.
const BOLTS = [
  [150, -20, 300, 1020, 16, 55, 2.4, 'l'],
  [1450, -20, 1290, 1020, 16, 55, 2.9, 'l'],
  [420, -20, 330, 760, 12, 45, 3.3, 'm'],
  [1180, -20, 1280, 740, 12, 45, 2.7, 'm'],
  [-20, 120, 760, 330, 13, 40, 3.8, 'm'],
  [1620, 110, 860, 310, 13, 40, 3.5, 'm'],
  [-20, -20, 1620, 1020, 22, 70, 5.4, 'x'],
  [1620, -20, -20, 1020, 22, 70, 6.6, 'x'],
  [-20, 700, 460, 1020, 8, 35, 1.9, 's'],
  [1620, 680, 1150, 1020, 8, 35, 2.1, 's'],
]

const STRIKE = 'values="0.22;1;0.3;1;0.5;1;0.85;0.35;0.8;0.22;0.22" keyTimes="0;0.03;0.07;0.1;0.15;0.2;0.3;0.4;0.46;0.55;1"'
const SLAM = 'values="0.15;1;0.2;1;0.4;1;0.9;0.3;0.85;0.15;0.15" keyTimes="0;0.02;0.05;0.08;0.12;0.16;0.28;0.36;0.42;0.52;1"'
let bolts = ''

BOLTS.forEach(([x0, y0, x1, y1, steps, jitter, dur, size], i) => {
  const d = zig(x0, y0, x1, y1, steps, jitter, size === 's' ? 1 : 2)
  // Start every bolt partway through its cycle, so several are lit at once.
  const delay = -((i * 0.41) % 1) * dur

  const anim = `<animate attributeName="opacity" ${size === 'x' ? SLAM : STRIKE} dur="${dur}s" begin="${delay.toFixed(2)}s" repeatCount="indefinite"/>`
  // Each line flickers on its own: flickering a whole group, or adding a wide
  // glow line per bolt, made the app's backdrop frame freeze.
  bolts += `<path class="edge ${size}" d="${d}" opacity="0.22">${anim}</path><path class="core ${size}" d="${d}" opacity="0.22">${anim}</path>`
})

// Red sparks rising off the bottom, like Hellforge's embers.
let sparks = ''
for (let i = 0; i < 14; i++) {
  const x = Math.round(rnd() * 1600)
  const r = (1 + rnd() * 2.2).toFixed(1)
  const dur = (5 + rnd() * 7).toFixed(1)
  const delay = (-rnd() * 12).toFixed(1)
  const fill = rnd() > 0.3 ? '#ff2a40' : '#ff8a96'

  const [tx, ty] = [[50, -980], [-70, -900], [20, -760]][i % 3]

  sparks += `<circle cx="${x}" cy="1010" r="${r}" fill="${fill}" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${tx} ${ty}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0.7;0" keyTimes="0;0.08;0.7;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></circle>`
}

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#060203"/>
    <stop offset="0.5" stop-color="#120407"/>
    <stop offset="0.85" stop-color="#2a050c"/>
    <stop offset="1" stop-color="#4a0712"/>
  </linearGradient>
  <radialGradient id="will" cx="0.5" cy="1.05" r="0.8">
    <stop offset="0" stop-color="#ff1030" stop-opacity="0.5"/>
    <stop offset="0.45" stop-color="#a0001a" stop-opacity="0.2"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="cloud" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#3a0610" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#3a0610" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
  .glow { stroke: #6e0014; stroke-width: 15; }
  .edge { stroke: #ff3a52; stroke-width: 5; }
  .core { stroke: #080002; stroke-width: 2; }
  .glow.x { stroke-width: 24; } .edge.x { stroke-width: 8; } .core.x { stroke-width: 3; }
  .glow.s { stroke-width: 10; } .edge.s { stroke-width: 3.5; } .core.s { stroke-width: 1.4; }
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<rect width="1600" height="1000" fill="url(#will)"><animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite"/></rect>
${bolts}
${sparks}
</svg>`
