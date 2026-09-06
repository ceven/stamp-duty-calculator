# Stamp Duty Calculator

A simple React + TypeScript app to calculate **NSW Stamp Duty**, built with Vite.

Homepage: https://ceven.github.io/stamp-duty-calculator/

## Commands

- `npm run dev` — start the dev server at http://localhost:5173/stamp-duty-calculator/
- `npm run build` — typecheck and build the production bundle into `dist/`
- `npm run preview` — preview the production build locally
- `npm test` — run the Vitest test suite once
- `npm run test:watch` — run tests in watch mode
- `npm run deploy` — build and deploy `dist/` to GitHub Pages (`gh-pages -d dist`)

## Property stamp duty (transfer duty)

General transfer duty rates for the 2026/27 financial year (valid from 1 July 2026):

| Dutiable value | Transfer duty |
|---|---|
| $0 – $18,000 | $1.25 per $100 (minimum $20) |
| $18,001 – $38,000 | $225 + $1.50 per $100 over $18,000 |
| $38,001 – $103,000 | $525 + $1.75 per $100 over $38,000 |
| $103,001 – $387,000 | $1,662 + $3.50 per $100 over $103,000 |
| $387,001 – $1,290,000 | $11,602 + $4.50 per $100 over $387,000 |
| Over $1,290,000 | $52,237 + $5.50 per $100 over $1,290,000 |
| Over $3,870,000 (residential) | $194,137 + $7.00 per $100 over $3,870,000 |

The home calculator includes a **first home buyer** toggle. When enabled, the First Home Buyers Assistance Scheme (FHBAS) applies: no duty on homes valued up to $800,000, and a reduced (sliding) rate for homes between $800,000 and $1,000,000, subject to eligibility.

**Rates are CPI-indexed by Revenue NSW each year (effective 1 July). The table above applies to the 2026/27 financial year only; verify current rates before relying on any figure.**

## Vehicle stamp duty (transfer duty)

Motor vehicle duty rates (passenger vehicles):

| Dutiable value | Transfer duty |
|---|---|
| $0 – $44,999 | $3.00 per $100 |
| $45,000 or more | $1,350 + $5.00 per $100 over $45,000 |

**Rates are set by Revenue NSW and are not CPI-adjusted. Verify current rates before relying on any figure.**