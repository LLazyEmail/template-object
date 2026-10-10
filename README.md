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
