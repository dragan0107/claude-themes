// Grand Voyage: a pirate ship on the open sea, sunny by day and moonlit in dark mode.
// Original art: a generic sailing ship, an island, gulls, sun, moon and stars.

// A small fixed-seed generator, so the sky lands the same on every reload.
let seed = 2024

function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}

function stars(count) {
  let out = ''

  for (let i = 0; i < count; i++) {
    const x = Math.round(rnd() * 1600)
    const y = Math.round(rnd() * 600)
    const r = (0.6 + rnd() * 1.5).toFixed(1)
    const duration = (2 + rnd() * 4).toFixed(1)
    const delay = (-rnd() * 6).toFixed(1)

    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" style="animation:tw ${duration}s ease-in-out ${delay}s infinite"/>`
  }

  return out
}

// One rolling layer of sea: a sine-like crest that slides sideways by one period.
function wave(y, amp, period, cls, seconds, reverse) {
  const half = period / 2
  let d = `M${-period} ${y}`

  for (let x = -period; x < 1600 + period; x += period) {
    d += ` q${half / 2} ${-amp} ${half} 0 t${half} 0`
  }
  d += ` V900 H${-period} Z`

  return `<path class="${cls}" d="${d}" style="--p:${reverse ? -period : period}px;animation:roll ${seconds}s linear infinite"/>`
}

function cloud(y, scale, seconds, delay) {
  return `<g style="animation:sail ${seconds}s linear ${delay}s infinite"><g class="cloud" transform="translate(0 ${y}) scale(${scale})">
<ellipse cx="0" cy="0" rx="90" ry="26"/><circle cx="-40" cy="-18" r="30"/><circle cx="0" cy="-34" r="40"/><circle cx="44" cy="-16" r="28"/><ellipse cx="80" cy="-4" rx="36" ry="18"/></g></g>`
}

function rays(count) {
  let out = ''

  for (let i = 0; i < count; i++) {
    out += `<polygon points="-9,-92 9,-92 0,-150" transform="rotate(${(360 / count) * i})"/>`
  }

  return out
}

function shimmer(count, cls) {
  let out = ''

  for (let i = 0; i < count; i++) {
    const w = 30 + Math.round(rnd() * 90)
    const x = 1180 - w / 2 + Math.round((rnd() - 0.5) * 120)
    const y = 652 + i * 9
    const duration = (1.6 + rnd() * 2.4).toFixed(1)

    out += `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="2.5" rx="1.2" style="animation:tw ${duration}s ease-in-out -${i}s infinite"/>`
  }

  return out
}

const GULL = 'M-13 0 Q-7 -9 0 0 Q7 -9 13 0'

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
  @keyframes roll { from { transform: translateX(0); } to { transform: translateX(var(--p)); } }
  @keyframes sail { from { transform: translateX(-320px); } to { transform: translateX(1920px); } }
  @keyframes tw { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
  @keyframes bob { 0%,100% { transform: translateY(0) rotate(-2.2deg); } 50% { transform: translateY(-7px) rotate(2.2deg); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes flap { 0%,100% { transform: skewY(-8deg) scaleX(1); } 50% { transform: skewY(8deg) scaleX(0.86); } }
  @keyframes fly { from { transform: translate(-80px, 0); } 50% { transform: translate(800px, -40px); } to { transform: translate(1700px, 10px); } }
  @keyframes wing { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.35); } }
  @keyframes glow { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
  .night { display: none; }
  .cloud { fill: #ffffff; opacity: 0.92; }
  .w1 { fill: #49bfe6; stroke: #ffffff; stroke-opacity: 0.55; stroke-width: 2; }
  .w2 { fill: #2199d4; stroke: #ffffff; stroke-opacity: 0.6; stroke-width: 2.5; }
  .w3 { fill: #1279bf; stroke: #ffffff; stroke-opacity: 0.55; stroke-width: 3; }
  .w4 { fill: #0b5c9e; stroke: #ffffff; stroke-opacity: 0.45; stroke-width: 3; }
  .ship { animation: bob 6s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
  .flag { animation: flap 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: 0 50%; }
  .rays { animation: spin 90s linear infinite; }
  .hat { animation: sway 5s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
  @keyframes sway { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(-5deg); } }
  .gull { fill: none; stroke: #24384d; stroke-width: 2.6; stroke-linecap: round; animation: wing 0.9s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
  .sd { fill: #fff6c8; }
  .sn { fill: #dfe8ff; }
  .isle { fill: #2f8f4e; }
  .sand { fill: #f1d48a; }
  .palm { stroke: #3a2a18; }
  .frond { fill: #23783f; }
  @media (prefers-color-scheme: dark) {
    .day { display: none; }
    .night { display: inline; }
    .cloud { fill: #2b3f70; opacity: 0.55; }
    .w1 { fill: #173867; stroke-opacity: 0.22; }
    .w2 { fill: #112b55; stroke-opacity: 0.2; }
    .w3 { fill: #0b1f43; stroke-opacity: 0.18; }
    .w4 { fill: #071632; stroke-opacity: 0.14; }
    .hull, .sails { filter: brightness(0.5) saturate(0.8); }
    .prop { filter: brightness(0.62) saturate(0.85); }
    .isle { fill: #0f2a2c; }
    .sand { fill: #2a3350; }
    .palm { stroke: #0a1220; }
    .frond { fill: #0c2428; }
  }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<defs>
  <linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2f9be8"/><stop offset="0.6" stop-color="#8fd3f7"/><stop offset="1" stop-color="#e6f7ff"/>
  </linearGradient>
  <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#040a1e"/><stop offset="0.65" stop-color="#0d1f48"/><stop offset="1" stop-color="#23407a"/>
  </linearGradient>
  <radialGradient id="sunG" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fffbe0"/><stop offset="0.4" stop-color="#ffe680" stop-opacity="0.7"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="moonG" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#dfe8ff" stop-opacity="0.55"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd76a"/><stop offset="0.3" stop-color="#ffb52e" stop-opacity="0.6"/><stop offset="1" stop-color="#ffb52e" stop-opacity="0"/>
  </radialGradient>
</defs>

<g class="day">
  <rect width="1600" height="900" fill="url(#skyD)"/>
  <g transform="translate(1180 170)">
    <circle r="230" fill="url(#sunG)"/>
    <g class="rays" fill="#ffe27a" opacity="0.75">${rays(14)}</g>
    <circle r="78" fill="#fff4b8"/>
    <circle r="64" fill="#ffe36e"/>
  </g>
</g>
<g class="night">
  <rect width="1600" height="900" fill="url(#skyN)"/>
  ${stars(90)}
  <g transform="translate(1180 170)">
    <circle r="210" fill="url(#moonG)" style="animation:glow 7s ease-in-out infinite"/>
    <circle r="70" fill="#f1f0dc"/>
    <circle cx="-22" cy="-18" r="13" fill="#d9d8c2"/><circle cx="24" cy="10" r="18" fill="#dcdbc6"/><circle cx="-10" cy="34" r="9" fill="#d9d8c2"/><circle cx="30" cy="-34" r="7" fill="#dcdbc6"/>
  </g>
</g>

${cloud(130, 1.5, 150, -20)}
${cloud(250, 1, 110, -70)}
${cloud(90, 0.8, 190, -120)}
${cloud(340, 1.2, 130, -100)}
${cloud(420, 0.7, 170, -45)}

<g class="day">
  <g style="animation:fly 38s linear infinite"><path class="gull" d="${GULL}" transform="translate(0 300)"/></g>
  <g style="animation:fly 46s linear -14s infinite"><path class="gull" d="${GULL}" transform="translate(0 220) scale(0.8)"/></g>
  <g style="animation:fly 52s linear -31s infinite"><path class="gull" d="${GULL}" transform="translate(0 380) scale(1.15)"/></g>
</g>

<g transform="translate(210 648)">
  <path class="isle" d="M-190 10 Q-120 -70 -20 -78 Q90 -84 190 10 Z"/>
  <path class="sand" d="M-215 14 Q-150 -8 0 -6 Q150 -8 220 14 Z"/>
  <path class="palm" d="M-30 -70 Q-46 -140 -22 -200" fill="none" stroke-width="9" stroke-linecap="round"/>
  <g class="frond" transform="translate(-22 -200)">
    <path d="M0 0 Q50 -42 104 -10 Q52 -22 0 0 Z"/><path d="M0 0 Q-52 -44 -106 -6 Q-54 -22 0 0 Z"/>
    <path d="M0 0 Q30 -70 84 -74 Q36 -50 0 0 Z"/><path d="M0 0 Q-28 -72 -80 -72 Q-34 -50 0 0 Z"/>
    <path d="M0 0 Q46 4 78 46 Q38 20 0 0 Z"/><path d="M0 0 Q-48 6 -76 50 Q-38 20 0 0 Z"/>
  </g>
  <path class="palm" d="M70 -62 Q84 -110 66 -150" fill="none" stroke-width="7" stroke-linecap="round"/>
  <g class="frond" transform="translate(66 -150) scale(0.7)">
    <path d="M0 0 Q50 -42 104 -10 Q52 -22 0 0 Z"/><path d="M0 0 Q-52 -44 -106 -6 Q-54 -22 0 0 Z"/>
    <path d="M0 0 Q30 -70 84 -74 Q36 -50 0 0 Z"/><path d="M0 0 Q-28 -72 -80 -72 Q-34 -50 0 0 Z"/>
  </g>
</g>

${wave(640, 7, 160, 'w1', 14, false)}
<g class="day">${shimmer(9, 'sd')}</g>
<g class="night">${shimmer(9, 'sn')}</g>

<g transform="translate(1040 680)">
  <g class="ship">
    <g class="hull">
      <line x1="118" y1="-38" x2="182" y2="-66" stroke="#4a2812" stroke-width="5" stroke-linecap="round"/>
      <path d="M-124 -36 L124 -36 Q114 6 82 16 L-88 16 Q-114 6 -124 -36 Z" fill="#6b3a1c"/>
      <path d="M-124 -36 L-124 -66 L-70 -66 L-62 -36 Z" fill="#7d4622"/>
      <path d="M-122 -26 L121 -26" stroke="#f2b01e" stroke-width="5"/>
      <path d="M-116 -10 L116 -10" stroke="#4a2812" stroke-width="3"/>
      <circle cx="-60" cy="-17" r="4" fill="#2a1508"/><circle cx="-20" cy="-17" r="4" fill="#2a1508"/><circle cx="20" cy="-17" r="4" fill="#2a1508"/><circle cx="60" cy="-17" r="4" fill="#2a1508"/>
      <g stroke="#4a2812" stroke-width="5" stroke-linecap="round">
        <line x1="10" y1="-36" x2="10" y2="-238"/><line x1="72" y1="-36" x2="72" y2="-196"/><line x1="-60" y1="-66" x2="-60" y2="-178"/>
      </g>
      <g stroke="#4a2812" stroke-width="1.2" opacity="0.7">
        <line x1="10" y1="-238" x2="124" y2="-36"/><line x1="10" y1="-238" x2="-124" y2="-62"/><line x1="72" y1="-196" x2="180" y2="-65"/>
      </g>
    </g>
    <g class="sails">
      <path d="M108 -176 L176 -64 L110 -72 Z" fill="#efe2bf"/>
      <path d="M-26 -222 Q10 -212 46 -222 L52 -166 Q10 -154 -32 -166 Z" fill="#fbf1d4"/>
      <path d="M-34 -156 Q10 -144 56 -156 L52 -72 Q10 -56 -30 -72 Z" fill="#fbf1d4"/>
      <path d="M-33 -122 Q10 -108 55 -122 L54 -102 Q10 -88 -32 -102 Z" fill="#e0312b"/>
      <path d="M40 -182 Q72 -174 104 -182 L108 -84 Q72 -70 36 -84 Z" fill="#f6ebc9"/>
      <path d="M-88 -162 Q-60 -155 -32 -162 L-30 -86 Q-60 -74 -90 -86 Z" fill="#f6ebc9"/>
      <g class="flag">
        <path d="M10 -240 L66 -236 L66 -202 L10 -206 Z" fill="#17171c"/>
        <circle cx="38" cy="-224" r="7.5" fill="#f4f1e4"/>
        <rect x="33.5" y="-219" width="9" height="6" rx="1.5" fill="#f4f1e4"/>
        <g stroke="#f4f1e4" stroke-width="2.6" stroke-linecap="round"><line x1="24" y1="-232" x2="52" y2="-210"/><line x1="52" y1="-232" x2="24" y2="-210"/></g>
        <circle cx="38" cy="-224" r="7.5" fill="#f4f1e4"/>
        <circle cx="35.2" cy="-224.5" r="1.8" fill="#17171c"/><circle cx="40.8" cy="-224.5" r="1.8" fill="#17171c"/>
      </g>
      <path class="flag" d="M72 -196 L102 -189 L72 -181 Z" fill="#f2b01e"/>
    </g>
    <g class="night">
      <circle cx="-112" cy="-78" r="34" fill="url(#lamp)" style="animation:glow 2.4s ease-in-out infinite"/>
      <circle cx="-112" cy="-78" r="4" fill="#fff1b0"/>
      <circle cx="120" cy="-48" r="22" fill="url(#lamp)" style="animation:glow 3.1s ease-in-out infinite"/>
      <circle cx="120" cy="-48" r="3" fill="#fff1b0"/>
    </g>
  </g>
</g>

${wave(694, 11, 220, 'w2', 11, true)}
${wave(762, 15, 300, 'w3', 9, false)}
${wave(836, 19, 400, 'w4', 7, true)}

<g transform="translate(1450 700)">
  <g class="prop">
    <path d="M-66 62 Q-80 140 -64 220 L64 220 Q80 140 66 62 Z" fill="#7a4521"/>
    <g fill="none" stroke="#4a2812" stroke-width="2" opacity="0.7"><path d="M-34 62 Q-42 140 -32 220"/><path d="M0 62 V220"/><path d="M34 62 Q42 140 32 220"/></g>
    <g fill="none" stroke="#2f2f36" stroke-width="9"><path d="M-70 84 Q0 98 70 84"/><path d="M-73 170 Q0 186 73 170"/></g>
    <ellipse cx="0" cy="62" rx="66" ry="14" fill="#5c3216"/>
    <g class="hat">
      <ellipse cx="0" cy="40" rx="134" ry="36" fill="#b98a2a"/>
      <ellipse cx="0" cy="33" rx="134" ry="35" fill="#ecc660"/>
      <g fill="none" stroke="#c99a36" stroke-width="2" opacity="0.7">
        <ellipse cx="0" cy="33" rx="118" ry="29"/><ellipse cx="0" cy="33" rx="102" ry="24"/>
      </g>
      <path d="M-76 28 Q-82 -64 0 -70 Q82 -64 76 28 Q0 48 -76 28 Z" fill="#f3d272"/>
      <g fill="none" stroke="#c99a36" stroke-width="2" opacity="0.6">
        <path d="M-70 -20 Q0 -4 70 -20"/><path d="M-60 -44 Q0 -32 60 -44"/><path d="M-36 -62 Q0 -56 36 -62"/>
      </g>
      <path d="M-78 4 Q0 26 78 4 L76 28 Q0 48 -76 28 Z" fill="#d6281f"/>
      <path d="M-78 4 Q0 26 78 4" fill="none" stroke="#a81a14" stroke-width="2"/>
    </g>
  </g>
</g>
</svg>`
