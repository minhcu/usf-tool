import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    "48": "public/logo.png",
  },

  action: {
    default_popup: "src/app/popup/index.html",
    default_icon: {
      "48": "public/logo.png",
    }
  },

  side_panel: {
    default_path: "src/app/sidepanel/index.html",
  },

  permissions: [
    "sidePanel",
    "storage",
    "activeTab",
    "scripting"
  ],

  host_permissions: ["<all_urls>"],
})
