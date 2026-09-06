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
- [Duty calculation module](#duty-calculation-module)
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
│   ├── duty.ts             # Pure duty calculation functions
│   ├── duty.test.ts        # Unit tests for the duty functions
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

- holds `value`, `duty`, `dutiable` (the type of dutiable item), `url`, `image`, and optional `assistance` in state,
- renders a number input bound to `handleChange`,
- validates input via `wrongValue()` (`isNaN` or negative),
- displays the computed duty or an error message,
- renders a link to the NSW Revenue duty rates page,
- optionally renders an assistance checkbox when `hasAssistance()` is true, with a label from `assistanceLabel()`,
- renders a rate table beside the input when `dutyTable()` returns rows (a `{ caption, rows }` object; `null` by default).

It exports the base class as default and also as a named export. Subclasses override `calculateDuty(value, assistance): number` and set their own initial state (labels, URLs, images). The `assistance` flag is passed to `calculateDuty` so subclasses can adapt the calculation (e.g. the First Home Buyers Assistance Scheme); `handleAssistanceChange` recomputes duty when the checkbox is toggled and `assistanceEnabled()` reads the current flag.

Note: subclasses bind `this.calculateDuty` in their constructors so it can be called from the shared `handleChange`.

### HomeStampDuty

Extends `StampDuty`. Implements the NSW **home/transfer** duty tiers using CPI-indexed 2026/27 rates, plus a **residential premium** tier above $3.87m and a **first home buyer** toggle:

| Property value   | Duty                              |
| ---------------- | --------------------------------- |
| ≤ $18,000        | 1.25% of value (minimum $20)      |
| ≤ $38,000        | $225 + 1.5% over $18,000          |
| ≤ $103,000       | $525 + 1.75% over $38,000         |
| ≤ $387,000       | $1,662 + 3.5% over $103,000       |
| ≤ $1,290,000     | $11,602 + 4.5% over $387,000      |
| ≤ $3,870,000     | $52,237 + 5.5% over $1,290,000    |
| > $3,870,000     | $194,137 + 7% over $3,870,000     |

When `assistance` is enabled, the **First Home Buyers Assistance Scheme (FHBAS)** applies: no duty on homes up to $800,000, and a sliding concession between $800,000 and $1,000,000 (full duty minus `dutyAt$800k × (1,000,000 − value) / 200,000`). Duty reverts to the general rate at $1,000,000 and above.

### MotorVehicleStampDuty

Extends `StampDuty`. Implements the NSW **motor vehicle** duty:

- value < $45,000 → 3% of value
- value ≥ $45,000 → $1,350 + 5% of value over $45,000

### Duty calculation module

`src/duty.ts` contains the pure, exported duty functions used by the calculators:

- `calculateHomeDuty(value)` — general transfer duty (2026/27 rates, including the $20 minimum and the premium tier).
- `calculateHomeDutyWithFhbas(value)` — transfer duty under the First Home Buyers Assistance Scheme.
- `calculateMotorVehicleDuty(value)` — motor vehicle duty.
- `formatDuty(duty)` — formats a number as AUD currency for display.

## Styling

Plain CSS files are imported directly in components and bundled by Vite. Design tokens (colors, shadows, radii) are defined as CSS custom properties in `:root` in `src/index.css`.

- `src/index.css` — global body styles, background gradient, and design tokens (`--color-*`, `--radius-*`, `--shadow-*`).
- `src/App.css` — header gradient, centered responsive body container, and footer.
- `src/StampDuty.css` — card grid via named areas (image + content in the first row, rates table spanning the row below), input focus & error states, striped rate table, and responsive stacking below 560px. The two calculators always stack vertically (home above vehicle).

Calculator cards can opt into a lookup modifier via `cardClassName()` (e.g. `"StampDuty--vehicle"`), which swaps the accent color for the card border, result, and table header.

## Assets and Images

- `src/assets/*.png` are imported as modules and bundled (fingerprinted by Vite into `dist/assets/`).
- `public/` files (`favicon.ico`, `manifest.json`) are copied verbatim to the build output root.

## Tests

Tests use **Vitest** with **React Testing Library** running in a **jsdom** environment.

- `src/App.test.tsx` — smoke test that renders `<App />` and asserts the title is present.
- `src/duty.test.ts` — unit tests for `calculateHomeDuty`, `calculateHomeDutyWithFhbas`, and `calculateMotorVehicleDuty`, including Revenue NSW's published example figures ($450,000 → $14,437; $1,350,000 → $55,537; $4,000,000 → $203,237).
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
3. Implement `calculateDuty(value: number, assistance: boolean): number`; if rates are involved, prefer adding a pure function in `src/duty.ts` and calling it from the component.
4. To show an assistance checkbox, override `hasAssistance()` to return `true` and `assistanceLabel()` with the checkbox text, then handle the flag inside `calculateDuty`.
5. Render the component inside the `<p className="App App-body">` block in `App`'s render method.
6. (Optional) Add tests for new duty formulas in `src/duty.test.ts`, or extend `App.test.tsx`.

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