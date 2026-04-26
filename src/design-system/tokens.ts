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

export const toneVar: Record<Tone, string> = {
  paleSlate: 'var(--color-pale-slate)',
  dustyGrape: 'var(--color-dusty-grape)',
  sunflowerGold: 'var(--color-sunflower-gold)',
  porcelain: 'var(--color-porcelain)',
  grapefruitPink: 'var(--color-grapefruit-pink)',
  flagRed: 'var(--color-flag-red)',
  black: 'var(--color-black)',
  midnightViolet: 'var(--color-midnight-violet)',
  magentaBloom: 'var(--color-magenta-bloom)',
  seaGreen: 'var(--color-sea-green)',
}

export const surfaces = ['porcelain', 'paleSlate90', 'dustyGrape90'] as const
export type Surface = (typeof surfaces)[number]

export const surfaceColor: Record<Surface, string> = {
  porcelain: 'var(--color-porcelain)',
  paleSlate90: '#f8f8fa',
  dustyGrape90: '#eeeff5',
}
