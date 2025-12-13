import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  format: ['cjs', 'esm'],
  clean: true,
  sourcemap: true,
  dts: true,
  target: 'es2022',
  splitting: false,
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    };
  },
  watch: process.env.NODE_ENV === 'development',
  onSuccess:
    process.env.NODE_ENV === 'development' ? 'node build/index.js' : undefined,
});
