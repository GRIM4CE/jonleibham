import { create } from 'storybook/theming'

/**
 * Storybook's chrome, in the design system's own palette. The components are
 * built for the dark ground and there is no light mode to switch to.
 *
 * Values are copied from `tokens.css` rather than imported: this is
 * manager-side config, so it cannot read a CSS custom property. Keep them in
 * step by hand.
 */
export const dossierDark = create({
  base: 'dark',

  brandTitle: 'Jon Leibham · Design System',
  brandUrl: 'https://jonleibham.com',
  brandTarget: '_blank',

  // --accent / --dusty-grape
  colorPrimary: '#ffc145',
  colorSecondary: '#ffc145',

  // --ground / --ground-raised / --surface
  appBg: '#1a0f16',
  appContentBg: '#1a0f16',
  appPreviewBg: '#1a0f16',
  appBorderColor: 'rgba(255, 255, 251, 0.12)',
  appBorderRadius: 8,

  // --text-primary / --text-secondary / --text-tertiary
  textColor: '#fffffb',
  textInverseColor: '#1a0f16',
  textMutedColor: '#8989b2',

  barBg: '#241521',
  barTextColor: '#b8b8d1',
  barHoverColor: '#ffc145',
  barSelectedColor: '#ffc145',

  inputBg: '#241521',
  inputBorder: 'rgba(255, 255, 251, 0.16)',
  inputTextColor: '#fffffb',
  inputBorderRadius: 6,

  buttonBg: '#241521',
  buttonBorder: 'rgba(255, 255, 251, 0.16)',

  booleanBg: '#241521',
  booleanSelectedBg: '#2e1d26',

  fontBase:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
})
