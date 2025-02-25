import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/fetch-demo/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/utils/setup.ts'],
    globals: true
  }
});
