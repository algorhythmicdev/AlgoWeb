import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  optimizeDeps: {
    include: ['svelte-i18n']
  },
  
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true
  }
});
