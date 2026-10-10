# Migration to TypeScript + tsup + Vitest

This project has been upgraded from:

- **Bundler**: Rollup → **tsup**
- **Test runner**: Jest → **Vitest**
- **Language**: JavaScript → **TypeScript**

## Changes

- All source files in `src/` renamed from `.js` to `.ts`
- Test files renamed to `.ts` and updated for Vitest (import syntax, removed unnecessary `new` on factory functions)
- Added `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`
- Updated `package.json` scripts and dependencies
- Removed Rollup, Babel, Jest related configs and dependencies
- Modern Node CI workflow
- Updated README

## To use

```bash
npm install
npm run build
npm test
```

The library still exports the same factories: `displayFactoryTwo`, `displayFactoryTwoPointFive`, `factoryFour`.
