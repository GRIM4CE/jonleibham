import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Stories live beside their components, in whichever workspace owns them —
  // the shared package and the portfolio app both. This app only hosts them, so
  // nothing here owns a story of its own.
  //
  // Sections are title prefixes, not globs, and they split by what a thing is
  // rather than by which workspace ships it:
  //   Components/  anything composable — the shared library and the portfolio's
  //                own parts sit together, because someone looking for a row or
  //                a tab bar does not care which package it came from
  //   Screens/     a whole view: rendered from data, the top of a tree rather
  //                than a piece of one
  "stories": [
    "../../../packages/design-system/src/**/*.mdx",
    "../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../portfolio-site/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  // The portfolio's screens reference its public assets by absolute path — the
  // portrait in AboutScreen, the resume PDF in CareerScreen. Without this they
  // render as broken images and dead links.
  "staticDirs": ["../../portfolio-site/public"],
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite"
};
export default config;
