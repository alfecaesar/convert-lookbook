import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'assets',
    emptyOutDir: false,

    rollupOptions: {
      input: 'src/main.jsx',

      output: {
        entryFileNames: 'react-app.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
});