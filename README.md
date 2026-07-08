# Kiva Labs

Kiva Labs is a modular desktop study workspace built with React, TypeScript, Vite, and Electron. It is designed to give students a central place to manage study activities, review flashcards, explore integrations, and customize which study tools are visible.

## What it does

The app currently includes:

- A dashboard as the main control center
- A flashcards experience for study review
- An integrations section for external tools and plugins
- Settings to enable or disable modules in the sidebar

## Notes on current functionality

Some modules are present as part of the app structure but are still represented by placeholder views, so the experience is currently focused on the dashboard, flashcards, integrations, and configuration options.

## Development

Install dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

Run the Electron desktop version:

```bash
npm run dev:electron
```

Build for production:

```bash
npm run build
```

## Tech stack

- React
- TypeScript
- Vite
- Electron