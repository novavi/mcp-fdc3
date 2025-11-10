import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleFormat } from 'rollup';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageJsName = 'McpFdc3Server';
const packageName = 'mcp-fdc3-server';

// https://vite.dev/guide/build#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageJsName,
      formats: ['es', 'iife'],
      fileName: (format: ModuleFormat, entryName: string) => {
        let extension;
        switch (format) {
          case 'es':
            extension = 'esm.js';
            break;
          case 'iife':
            extension = 'js';
            break;
        }
        return `${packageName}.${extension}`;
      },
     },
    minify: false,
    sourcemap: true
  },
  plugins: [dts()],
});
