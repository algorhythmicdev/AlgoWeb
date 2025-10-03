import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      runtime: 'edge',
      regions: ['fra1'],
      split: true
    }),
    
    prerender: {
      entries: [
        '/',
        '/products',
        '/products/nodevoyage',
        '/products/ideonautix',
        '/community',
        '/consulting',
        '/contact'
      ]
    },
    
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
