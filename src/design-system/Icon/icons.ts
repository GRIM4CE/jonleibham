/**
 * The icon roster, kept out of Icon.tsx so that file only exports a component
 * (see the react-refresh lint rule) and so consumers can type an icon name
 * without pulling the component in.
 */
export const iconNames = [
  'home',
  'layoutGrid',
  'briefcase',
  'user',
  'search',
  'arrowLeft',
  'arrowUpRight',
  'chevronRight',
  'download',
  'share',
  'graduationCap',
  'linkedin',
  'github',
] as const

export type IconName = (typeof iconNames)[number]
