import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';
const basePath = dev ? '' : process.env.BASE_PATH || '/AlgoWeb';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    paths: { base: basePath, assets: basePath },
    prerender: {
      entries: ['*'],
      handleHttpError: ({ status, path, referrer, referenceType }) => {
        // Ignore 404s for case-variant asset extensions (e.g., .PNG, .JPG, .WEBM)
        if (status === 404 && referenceType === 'linked') {
          const lowerPath = path.toLowerCase();
          if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || 
              lowerPath.endsWith('.jpeg') || lowerPath.endsWith('.webp') ||
              lowerPath.endsWith('.webm')) {
            return;
          }
        }
        throw new Error(`${status} ${path}${referrer ? ` (linked from ${referrer})` : ''}`);
      }
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
