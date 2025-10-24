import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';
const basePath = dev ? '' : process.env.BASE_PATH || '/AlgoWeb';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    paths: { base: basePath },
    prerender: { entries: ['*'] },

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
