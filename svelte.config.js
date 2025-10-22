import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',   // static 404 fallback
      precompress: true
    }),

    alias: {
      '$lib': 'src/lib',
      '$components': 'src/lib/components',
      '$sections': 'src/lib/sections',
      '$stores': 'src/lib/stores',
      '$utils': 'src/lib/utils',
      '$config': 'src/lib/config',
      '$data': 'src/lib/data'
    }
  }
};

export default config;
