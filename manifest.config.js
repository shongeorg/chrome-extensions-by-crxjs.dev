import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'Stock Images',
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: [
    'activeTab',
  ],
  host_permissions: [
    'https://api.unsplash.com/*',
    'https://api.pexels.com/*',
    'https://pixabay.com/*',
    'https://images.unsplash.com/*',
    'https://images.pexels.com/*',
    'https://cdn.pixabay.com/*',
  ],
})
