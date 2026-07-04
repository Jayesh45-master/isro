import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: [
      { find: 'three/addons', replacement: path.resolve(__dirname, './libs/addons') },
      { find: 'three', replacement: path.resolve(__dirname, './libs/three.module.js') }
    ]
  },
  build: {
    chunkSizeWarningLimit: 1600 // Silences the warning for Three.js chunk size
  }
});
