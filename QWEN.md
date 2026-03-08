# Project Context: Tasks (Chrome Extension)

## Project Overview

This is a **Chrome Extension** project built with **Vite** and the **@crxjs/vite-plugin**. It implements a Manifest V3 extension with the following components:

- **Popup UI** (`src/popup/`) - The main popup interface shown when clicking the extension icon
- **Side Panel** (`src/sidepanel/`) - A side panel interface for extended functionality
- **Content Script** (`src/content/`) - Injects JavaScript into web pages (matches `https://*/*`)
- **Assets** (`src/assets/`) - SVG logos for Vite, JavaScript, and CRXJS

### Key Technologies

- **Build Tool:** Vite 7.x
- **Extension Framework:** CRXJS Vite Plugin (@crxjs/vite-plugin)
- **Language:** Vanilla JavaScript (ES Modules)
- **Manifest Version:** Chrome Extension Manifest V3

### Permissions

- `sidePanel` - Enables the side panel feature
- `contentSettings` - Allows modification of content settings

## Building and Running

### Development

```bash
npm run dev
```

Starts the Vite development server with hot module replacement (HMR) for the extension.

### Production Build

```bash
npm run build
```

Builds the extension for production. Outputs:
- `dist/` - The built extension files
- `release/` - A ZIP archive (`crx-tasks-<version>.zip`) ready for distribution

## Project Structure

```
tasks/
├── manifest.config.js    # Chrome extension manifest configuration
├── vite.config.js        # Vite build configuration
├── package.json          # Dependencies and scripts
├── public/
│   └── logo.png          # Extension icon (48x48)
└── src/
    ├── assets/           # SVG logos
    ├── content/
    │   └── main.js       # Content script (injected into web pages)
    ├── popup/
    │   ├── index.html    # Popup HTML entry point
    │   ├── main.js       # Popup JavaScript logic
    │   ├── counter.js    # Counter utility module
    │   └── style.css     # Popup styles
    └── sidepanel/
        ├── index.html    # Side panel HTML entry point
        ├── main.js       # Side panel JavaScript logic
        ├── counter.js    # Counter utility module
        └── style.css     # Side panel styles
```

## Development Conventions

- **Module System:** ES Modules (`"type": "module"` in package.json)
- **Path Alias:** `@` resolves to `src/` directory
- **Code Style:** Vanilla JavaScript with no framework dependencies
- **Styling:** Plain CSS with support for light/dark color schemes

## Notes

- The extension is currently a scaffold/template with basic counter functionality
- Both popup and sidepanel share similar structure and counter logic
- The content script logs a message to the console when injected
