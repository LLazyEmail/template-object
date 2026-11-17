# template-object

`npm install email-template-object` or `yarn add email-template-object`

Built with **TypeScript**, bundled with **tsup**, tested with **Vitest**.

## Goals

- A tree like structure for rendering components in a "recursive" way
- Ability to add checks and return errors
- An `isError` flag to understand if everything is ok
- Be able to return data
- Merge with previous test cases
- Better handling of subcomponents
- Have a template object that can also be used as source

## Development

```bash
npm install
npm run build      # uses tsup
npm test           # uses vitest
npm run typecheck  # tsc --noEmit
npm run dev        # tsup in watch mode
```

## CI / GitHub Actions

| Workflow | File | When it runs | What it does |
| --- | --- | --- | --- |
| Node.js CI | `node.js.yml` | push and PR to `main` | `npm ci`, `npm run build` (tsup) and `npm test` (Vitest) on Node 20, 22 and 24. `npm ci` needs `package-lock.json` in sync with `package.json`; after changing dependencies run `npm install` and commit the lockfile. |
| CodeQL | `codeql.yml` | push and PR to `main`, plus a weekly schedule | GitHub code scanning; findings show under Security → Code scanning. |
| Node.js Package | `npm-publish.yml` | when a GitHub release is created | Runs the tests on Node 22, then `npm publish` with the `npm_token` secret. |

`yarn.lock` is a leftover from the pre-TypeScript setup; CI only uses npm and `package-lock.json`.

## Build outputs

- `dist/index.js` — ESM
- `dist/index.cjs` — CommonJS
- `dist/index.global.js` — IIFE (browser)
- `dist/index.d.ts` — TypeScript declarations

## Example

```ts
import { factoryFour } from 'email-template-object';

const settings = {
  component: (params: any) => `Hello ${params.name}`,
  params: { name: 'World' }
};

const factory = factoryFour(settings);
console.log(factory.display());
```
