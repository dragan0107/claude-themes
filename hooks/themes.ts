import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE as ABYSS } from './scenes/abyss.js'
import { SCENE as CYBERPUNK } from './scenes/cyberpunk.js'
import { SCENE as SAKURA } from './scenes/sakura.js'
import { SCENE as AURORA } from './scenes/aurora.js'
import { SCENE as FIREFLY } from './scenes/firefly.js'
import { SCENE as DUNES } from './scenes/dunes.js'
import { SCENE as PHOSPHOR } from './scenes/phosphor.js'
import { SCENE as HELLFORGE } from './scenes/hellforge.js'
import { SCENE as VOYAGE } from './scenes/voyage.js'
import { SCENE as HAKI } from './scenes/haki.js'

type Palette = Parameters<typeof makeColors>[0]

export type ThemeDef = {
  id: string
  name: string
  blurb: string
  /** Three colors shown as a swatch in the picker. */
  swatch: readonly [string, string, string]
  palette: Palette
  scene: string
  sceneAlt: string
  glass: NonNullable<Extract<ThemeSetArgs['backdrop'], { scene: string }>['glass']>
}

export const THEMES: readonly ThemeDef[] = [
  {
    id: 'haki',
    name: 'Haki',
    blurb: "Conqueror's will: nonstop black-and-crimson lightning tearing a blood-dark sky",
    swatch: ['#e0182d', '#ff2b45', '#a04bd0'],
    palette: {
      label: 'Haki',
      only: 'dark',
      roles: { accent: '#e0182d', danger: '#e8482a', success: '#3f9d6a', warning: '#d79a1e', pro: '#a04bd0' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0d0507',
            'surface-1': '#150a0c',
            'surface-2': '#1c0d10',
            'surface-3': '#221113',
            'text-primary': '#f6e9ea',
            'text-secondary': '#d3bcbe',
            'text-muted': '#ab9093',
          },
        },
      },
    },
    scene: HAKI,
    sceneAlt: 'Black-cored crimson lightning tearing across a dark red sky',
    glass: { blur: 0, tint: '#0d0507', opacity: 0.3 },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    blurb: 'Neon magenta and cyan over a rainy night city',
    swatch: ['#ff2bd6', '#00e5ff', '#ffd23f'],
    palette: {
      label: 'Cyberpunk',
      only: 'dark',
      roles: { accent: '#ff2bd6', danger: '#ff3b5c', success: '#2bffb0', warning: '#ffd23f', pro: '#00e5ff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0b0716',
            'surface-1': '#120c22',
            'surface-2': '#181030',
            'surface-3': '#1d1438',
            'text-primary': '#f2ecff',
            'text-secondary': '#cdbff0',
            'text-muted': '#a493d4',
          },
        },
        git: {
          added: '#2bffb0',
          removed: '#ff3b5c',
          modified: '#ffd23f',
          merged: '#b26bff',
          closed: '#ff3b5c',
          conflicting: '#ff8a3d',
          draft: '#8a7fb0',
        },
      },
    },
    scene: CYBERPUNK,
    sceneAlt: 'A rainy neon city skyline at night above a glowing scrolling grid',
    glass: { blur: 18, tint: '#0b0716', opacity: 0.72 },
  },
  {
    id: 'abyss',
    name: 'Abyss',
    blurb: 'Glowing jellyfish and light rays in the deep sea',
    swatch: ['#2ee6d6', '#9b7bff', '#ff5aa8'],
    palette: {
      label: 'Abyss',
      only: 'dark',
      roles: { accent: '#2ee6d6', danger: '#ff5a7a', success: '#5cf28a', warning: '#ffc94d', pro: '#a98bff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#04111a',
            'surface-1': '#071a26',
            'surface-2': '#0a2131',
            'surface-3': '#0d2739',
            'text-primary': '#e3f7ff',
            'text-secondary': '#b4d9e6',
            'text-muted': '#86b3c4',
          },
        },
      },
    },
    scene: ABYSS,
    sceneAlt: 'A deep sea with drifting glowing jellyfish, light rays and rising specks',
    glass: { blur: 16, tint: '#04111a', opacity: 0.7 },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    blurb: 'Cherry blossoms: pink paper by day, moonlit night in dark mode',
    swatch: ['#d6407a', '#f7a8c0', '#5f8f3e'],
    palette: {
      label: 'Sakura',
      roles: { accent: '#d6407a', danger: '#c8323c', success: '#5f8f3e', warning: '#c98a1c', pro: '#7b5cc4' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#fbf4f2',
            'surface-1': '#fdf8f6',
            'surface-2': '#fffcfc',
            'text-primary': '#3a2228',
            'text-secondary': '#5e3f46',
            'text-muted': '#7a5a61',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#1a1216',
            'surface-1': '#22171c',
            'surface-2': '#2a1d23',
            'surface-3': '#31222a',
            'text-primary': '#f8e9ee',
            'text-secondary': '#dcc3cb',
            'text-muted': '#b39aa3',
          },
        },
      },
    },
    scene: SAKURA,
    sceneAlt: 'Cherry branches in the corners with petals drifting down',
    // No tint: the panels keep the theme's own color in each mode.
    glass: { blur: 14, opacity: 0.68 },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    blurb: 'Northern lights rippling over snowy peaks',
    swatch: ['#4be3a0', '#b18cff', '#5ad1ff'],
    palette: {
      label: 'Aurora',
      only: 'dark',
      roles: { accent: '#4be3a0', danger: '#ff6b7d', success: '#a3e635', warning: '#ffd166', pro: '#b18cff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#07101c',
            'surface-1': '#0b1626',
            'surface-2': '#0f1c2f',
            'surface-3': '#132238',
            'text-primary': '#e6f3ff',
            'text-secondary': '#b9cfe3',
            'text-muted': '#8ea8c2',
          },
        },
      },
    },
    scene: AURORA,
    sceneAlt: 'Green and violet northern lights rippling above snowy mountains at night',
    glass: { blur: 16, tint: '#07101c', opacity: 0.68 },
  },
  {
    id: 'firefly',
    name: 'Firefly',
    blurb: 'A moonlit pine forest full of blinking fireflies',
    swatch: ['#ffd75e', '#8fd16a', '#7fd3c7'],
    palette: {
      label: 'Firefly',
      only: 'dark',
      roles: { accent: '#ffd75e', danger: '#ff7059', success: '#8fd16a', warning: '#ff9f43', pro: '#7fd3c7' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0a120c',
            'surface-1': '#0f1a12',
            'surface-2': '#132117',
            'surface-3': '#17281c',
            'text-primary': '#eef5e6',
            'text-secondary': '#c8d8bd',
            'text-muted': '#9db293',
          },
        },
      },
    },
    scene: FIREFLY,
    sceneAlt: 'A dark pine forest under the moon with glowing fireflies drifting',
    glass: { blur: 14, tint: '#0a120c', opacity: 0.66 },
  },
  {
    id: 'dunes',
    name: 'Dunes',
    blurb: 'Warm sand by day, a starry desert night in dark mode',
    swatch: ['#d9822b', '#f0c995', '#7b5ea7'],
    palette: {
      label: 'Dunes',
      roles: { accent: '#d9822b', danger: '#c43d3d', success: '#5e8c31', warning: '#b8860b', pro: '#7b5ea7' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#fbf3e6',
            'surface-1': '#fdf8ef',
            'surface-2': '#fffcf6',
            'text-primary': '#3b2b1c',
            'text-secondary': '#5f4a35',
            'text-muted': '#7a634b',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#16131f',
            'surface-1': '#1d1928',
            'surface-2': '#242031',
            'surface-3': '#2a2539',
            'text-primary': '#f3ead9',
            'text-secondary': '#d6cab5',
            'text-muted': '#ad9f8a',
          },
        },
      },
    },
    scene: DUNES,
    sceneAlt: 'Rolling sand dunes under a hazy sun, or under stars and a crescent moon',
    glass: { blur: 14, opacity: 0.66 },
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    blurb: 'A green-screen terminal with a scan beam and blinking cursor',
    swatch: ['#39ff7a', '#b3ff66', '#4fd6ff'],
    palette: {
      label: 'Phosphor',
      only: 'dark',
      roles: { accent: '#39ff7a', danger: '#ff5f56', success: '#b3ff66', warning: '#ffcc33', pro: '#4fd6ff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#030a05',
            'surface-1': '#06120a',
            'surface-2': '#08170d',
            'surface-3': '#0b1d11',
            'text-primary': '#c8ffd4',
            'text-secondary': '#95e0a6',
            'text-muted': '#6fb882',
          },
        },
      },
    },
    scene: PHOSPHOR,
    sceneAlt: 'A green-screen terminal with faint scrolling hex columns and a blinking cursor',
    glass: { blur: 10, tint: '#030a05', opacity: 0.72 },
  },
  {
    id: 'hellforge',
    name: 'Hellforge',
    blurb: 'Black basalt, lava cracks and embers rising from a forge',
    swatch: ['#ff5a1f', '#ffb020', '#ff2d3f'],
    palette: {
      label: 'Hellforge',
      only: 'dark',
      contrast: 'more',
      roles: { accent: '#ff5a1f', danger: '#ff2d3f', success: '#8fd13a', warning: '#ffb020', pro: '#b05cff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0b0706',
            'surface-1': '#130c0a',
            'surface-2': '#1a110e',
            'surface-3': '#20150f',
            'text-primary': '#f6e9df',
            'text-secondary': '#d6c2b3',
            'text-muted': '#ad998d',
          },
        },
        git: { added: '#8fd13a', removed: '#ff2d3f', modified: '#ffb020' },
      },
    },
    scene: HELLFORGE,
    sceneAlt: 'Embers rising from a forge between black basalt cliffs with glowing lava cracks',
    glass: { blur: 10, tint: '#0b0706', opacity: 0.72 },
  },
  {
    id: 'voyage',
    name: 'Straw Hat',
    blurb: 'A straw hat, a pirate ship and the open sea: sunny by day, moonlit in dark mode',
    swatch: ['#f2b01e', '#e0312b', '#2a9df4'],
    palette: {
      label: 'Grand Voyage',
      roles: { accent: '#f2b01e', danger: '#e0312b', success: '#3fae5a', warning: '#f07c1c', pro: '#2a9df4' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#e9f4fb',
            'surface-1': '#f2f9fd',
            'surface-2': '#fbfdff',
            'text-primary': '#10263b',
            'text-secondary': '#30495f',
            'text-muted': '#4d6679',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#07132a',
            'surface-1': '#0b1a36',
            'surface-2': '#0f2040',
            'surface-3': '#12254a',
            'text-primary': '#eef4ff',
            'text-secondary': '#c3d2ea',
            'text-muted': '#93a8c8',
          },
        },
      },
    },
    scene: VOYAGE,
    sceneAlt: 'A straw hat with a red band on a barrel, and a pirate ship bobbing on rolling waves beside a palm island, under the sun or the moon',
    // No tint: the panels keep the theme's own color in each mode.
    glass: { blur: 14, opacity: 0.66 },
  },
]

export const findTheme = (id: string | undefined): ThemeDef | undefined =>
  THEMES.find(t => t.id === id?.trim().toLowerCase())

/** The look sent to the app, plus any line that would stop Desktop painting it. */
export const lookFor = (t: ThemeDef): { look: ThemeSetArgs; unpainted?: string } => {
  const { theme, problems } = makeColors(t.palette)
  const look: ThemeSetArgs = { colors: theme, backdrop: { scene: t.id, glass: t.glass } }

  return { look, unpainted: problems.find(line => line.startsWith("Desktop won't paint")) }
}
