import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  globalName: 'newsletterLayoutsBodyPlainJS',
  splitting: false,
  // Mark dependencies as external if not bundling them
  external: ['lodash', 'object-assign', 'easy-factory'],
});