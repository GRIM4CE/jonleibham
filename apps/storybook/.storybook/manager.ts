import { addons } from 'storybook/manager-api'
import { dossierDark } from './theme'

// The manager UI — sidebar, toolbar, chrome. `preview.ts` themes the docs
// pages separately: they render inside the preview iframe, which this config
// does not reach.
addons.setConfig({ theme: dossierDark })
