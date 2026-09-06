# Stamp Duty Calculator — Project Info

An **NSW Stamp Duty** calculator built with **React 18 + TypeScript**, bundled with **Vite**, and deployed to **GitHub Pages**.

Homepage: https://ceven.github.io/stamp-duty-calculator/

## Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
  - [npm run dev](#npm-run-dev)
  - [npm run build](#npm-run-build)
  - [npm run preview](#npm-run-preview)
  - [npm test](#npm-test)
  - [npm run deploy](#npm-run-deploy)
- [Configuration](#configuration)
  - [Vite](#vite)
  - [TypeScript](#typescript)
  - [GitHub Pages base path](#github-pages-base-path)
  - [HTML entry point](#html-entry-point)
- [Components](#components)
  - [App](#app)
  - [StampDuty base class](#stampduty-base-class)
  - [HomeStampDuty](#homestampduty)
  - [MotorVehicleStampDuty](#motorvehicestampduty)
- [Styling](#styling)
- [Assets and Images](#assets-and-images)
- [Tests](#tests)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)
  - [Adding a new duty calculator](#adding-a-new-duty-calculator)
  - [Running the type checker](#running-the-type-checker)
  - [Updating dependencies](#updating-dependencies)

## Architecture

The app is a static single-page application. Users enter a dutiable value (home purchase price or motor vehicle price) and the app computes the applicable NSW stamp duty using tiered rate formulas.

The UI is built from class components:

```
App
├── HomeStampDuty (extends StampDuty)
└── MotorVehicleStampDuty (extends StampDuty)
```

`App` renders the header, both calculators, and the footer. Each calculator extends the shared `StampDuty` base class, which handles input, validation, and rendering; subclasses provide their own `calculateDuty(value)` formula, labels, links, and images.

There is no router, state library, or API layer — the app is fully client-side and stateless beyond local component state.

## Technology Stack

| Concern        | Technology                                        |
| -------------- | ------------------------------------------------- |
| Framework      | React 18                                          |
| Language       | TypeScript                                        |
| Build tool     | Vite 5                                            |
| Development    | Vite dev server (with HMR)                        |
| Testing        | Vitest + React Testing Library + jsdom            |
| Styling        | Plain CSS (imported per component)                |
| Deployment     | GitHub Pages via `gh-pages` package               |

## Project Structure

```
.
├── index.html              # Vite HTML entry (references /src/main.tsx)
├── vite.config.ts          # Vite + Vitest configuration
├── tsconfig.json           # TypeScript config (app code)
├── tsconfig.node.json      # TypeScript config (vite.config.ts)
├── package.json
├── .gitignore
├── public/                 # Static assets copied to dist/ as-is
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── main.tsx            # Entry point: mounts App into #root
│   ├── App.tsx             # Root component + subclass calculators
│   ├── StampDuty.tsx       # Base calculator component
│   ├── App.css
│   ├── StampDuty.css
│   ├── index.css
│   ├── App.test.tsx        # Vitest smoke test
│   ├── setupTests.ts       # Test setup (jest-dom matchers)
│   ├── vite-env.d.ts       # Vite client type references
│   └── assets/             # Imported images (house, car, stamp)
└── dist/                   # Build output (git-ignored)
```

Note: `dist/` is the production build output and is not committed. The repository used to deploy CRA build artifacts directly into the `gh-pages` branch; that workflow is replaced by building locally and publishing `dist/`.

## Available Scripts

### `npm run dev`

Starts the Vite dev server with hot module replacement.

```bash
npm run dev
```

Because the GitHub Pages base path is `/stamp-duty-calculator/`, the app is served at:

```
http://localhost:5173/stamp-duty-calculator/
```

### `npm run build`

Runs the TypeScript type checker, then builds the production bundle:

```bash
npm run build
```

This runs `tsc && vite build`. Output is written to `dist/`. The build fails on any TypeScript error (strict mode is enabled).

### `npm run preview`

Serves the production build locally so you can verify `dist/` before deploying:

```bash
npm run preview
```

### `npm test`

Runs the Vitest test suite once (non-watch):

```bash
npm test
```

`npm run test:watch` runs Vitest in watch mode for development.

### `npm run deploy`

Builds the project and publishes `dist/` to the `gh-pages` branch:

```bash
npm run deploy
```

This runs `npm run build` (via the `predeploy` hook) followed by `gh-pages -d dist`.

## Configuration

### Vite

`vite.config.ts` configures the React plugin and the Vitest environment:

```ts
export default defineConfig({
  plugins: [react()],
  base: "/stamp-duty-calculator/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
```

### TypeScript

- `tsconfig.json` covers `src/` with strict settings (`strict`, `noUnusedLocals`, `noUnusedParameters`, etc.) and `jsx: "react-jsx"` (the automatic JSX runtime — explicit `import React` is not required in components).
- `tsconfig.node.json` covers tooling files like `vite.config.ts`.
- `src/vite-env.d.ts` pulls in the `vite/client` types, which declare modules for `.png` and other asset imports so `import house from "./assets/house.png"` type-checks.

### GitHub Pages base path

The site is hosted under `https://ceven.github.io/stamp-duty-calculator/`, so Vite's `base` is set to `/stamp-duty-calculator/`. This prefixes asset URLs and the built HTML references with that path (see the generated `dist/index.html`).

### HTML entry point

Unlike Create React App (which used `public/index.html` as a template), Vite uses a root `index.html` as the entry point. It contains the HTML shell, the `<div id="root">` mount point, and a module script reference to `/src/main.tsx`. `%BASE_URL%` is replaced with the configured base path during the build, e.g.:

```html
<link rel="manifest" href="%BASE_URL%manifest.json" />
```

## Components

### App

`src/App.tsx` defines `App` plus the two concrete calculators. `App` renders:

- a header with the stamp logo and title,
- the NSW body containing `<HomeStampDuty />` and `<MotorVehicleStampDuty />`,
- a footer with attribution links.

### StampDuty base class

`src/StampDuty.tsx` is the shared base component. It:

- holds `value`, `duty`, `dutiable` (the type of dutiable item), `url`, and `image` in state,
- renders a number input bound to `handleChange`,
- validates input via `wrongValue()` (`isNaN` or negative),
- displays the computed duty or an error message,
- renders a link to the NSW Revenue duty rates page.

It exports the base class as default and also as a named export. Subclasses override `calculateDuty(value): number` and set their own initial state (labels, URLs, images).

Note: subclasses bind `this.calculateDuty` in their constructors so it can be called from the shared `handleChange`.

### HomeStampDuty

Extends `StampDuty`. Implements the NSW **home/transfer** duty tiers:

| Property value   | Duty                            |
| ---------------- | ------------------------------- |
| ≤ $14,000        | 1.25% of value                  |
| ≤ $30,000        | $175 + 1.5% over $14,000        |
| ≤ $80,000        | $415 + 1.75% over $30,000       |
| ≤ $300,000       | $1,290 + 3.5% over $80,000      |
| ≤ $1,000,000     | $8,990 + 4.5% over $300,000     |
| > $1,000,000     | $40,490 + 5.5% over $1,000,000  |

### MotorVehicleStampDuty

Extends `StampDuty`. Implements the NSW **motor vehicle** duty:

- value < $50,000 → 3% of value
- value ≥ $50,000 → $1,350 + 5% of value

## Styling

Plain CSS files are imported directly in components and bundled by Vite:

- `src/index.css` — global body styles
- `src/App.css` — header, footer, layout
- `src/StampDuty.css` — calculator card, input, and error styles

## Assets and Images

- `src/assets/*.png` are imported as modules and bundled (fingerprinted by Vite into `dist/assets/`).
- `public/` files (`favicon.ico`, `manifest.json`) are copied verbatim to the build output root.

## Tests

Tests use **Vitest** with **React Testing Library** running in a **jsdom** environment.

- `src/App.test.tsx` — smoke test that renders `<App />` and asserts the title is present.
- `src/setupTests.ts` — imports `@testing-library/jest-dom/vitest` for DOM matchers like `toBeInTheDocument()`.

Run once with `npm test`, or in watch mode with `npm run test:watch`.

## Deployment

Deployment uses the `gh-pages` npm package:

1. `npm run deploy` triggers `predeploy` → `npm run build`, which runs `tsc && vite build` and emits `dist/`.
2. `gh-pages -d dist` publishes the contents of `dist/` to the `gh-pages` branch.
3. GitHub Pages serves the site at https://ceven.github.io/stamp-duty-calculator/.

The `base: "/stamp-duty-calculator/"` setting in `vite.config.ts` ensures asset URLs resolve correctly under the sub-path.

## Common Tasks

### Adding a new duty calculator

1. Add a subclass of `StampDuty` in `src/App.tsx` (mirroring `HomeStampDuty` / `MotorVehicleStampDuty`).
2. Set its initial state: `dutiable` label, `url` to the relevant NSW Revenue page, and `image`.
3. Implement `calculateDuty(value: number): number`.
4. Render the component inside the `<p className="App App-body">` block in `App`'s render method.
5. (Optional) Add tests in a new `*.test.tsx` file, or extend `App.test.tsx`.

### Running the type checker

```bash
npx tsc --noEmit
```

### Updating dependencies

```bash
npm install
npm audit
```

After upgrading React or Vite major versions, verify with `npm run build` (typecheck + bundle) and `npm test`.