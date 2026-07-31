export const tones = [
  'paleSlate',
  'dustyGrape',
  'sunflowerGold',
  'porcelain',
  'grapefruitPink',
  'flagRed',
  'black',
  'midnightViolet',
  'magentaBloom',
  'seaGreen',
] as const

export type Tone = (typeof tones)[number]

export const surfaces = ['porcelain', 'paleSlate90', 'dustyGrape90'] as const
export type Surface = (typeof surfaces)[number]

// The color values themselves live in `tones.module.css`, one class per
// tone/slot pair, so components can apply them without an inline `style`
// attribute (which the deployed CSP blocks). See `tones.ts`.

