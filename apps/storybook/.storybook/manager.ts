import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

/*
 * The manager UI — sidebar, toolbar, chrome.
 *
 * Storybook's own logo and link are replaced with the name, set as text rather
 * than an image: the JL tile is a favicon, and at the 100px Storybook gives a
 * brand image it read as a badge stuck to the sidebar. It goes back to
 * jonleibham.com, since this Storybook is a wing of the portfolio rather than
 * a site of its own.
 *
 * The palette is lifted from packages/design-system/src/tokens.css by hand.
 * The manager is a separate React app that never loads the design system's
 * stylesheet, so the values cannot be `var(--ground)` here — they are copies,
 * and a token change has to be repeated in this file.
 */
addons.setConfig({
  theme: create({
    base: 'dark',

    // No brandImage, so this renders as the header text itself.
    brandTitle: 'Jon Leibham',
    brandUrl: 'https://jonleibham.com/',
    brandTarget: '_self',

    appBg: '#1a0f16',
    appContentBg: '#1a0f16',
    appPreviewBg: '#1a0f16',
    appBorderColor: 'rgba(184, 184, 209, 0.18)',
    appBorderRadius: 12,

    barBg: '#241521',
    barSelectedColor: '#ffc145',
    barTextColor: '#b8b8d1',

    colorPrimary: '#ffc145',
    colorSecondary: '#ffc145',
    textColor: '#fffffb',
    textInverseColor: '#1a0f16',
    textMutedColor: '#b8b8d1',

    inputBg: '#2e1d26',
    inputBorder: 'rgba(184, 184, 209, 0.18)',
    inputTextColor: '#fffffb',
  }),
})
