import fs from 'node:fs';
import path from 'node:path';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const adapterOptions = {
  runtime: 'edge',
  regions: ['fra1'],
  split: true
};

if (process.platform === 'win32') {
  adapterOptions.runtime = 'nodejs18.x';
  adapterOptions.split = false;

  const originalSymlink = fs.symlinkSync.bind(fs);
  fs.symlinkSync = (target, destination, type) => {
    try {
      return originalSymlink(target, destination, type);
    } catch (error) {
      if (error && error.code === 'EPERM') {
        const resolvedTarget = path.isAbsolute(target)
          ? target
          : path.resolve(path.dirname(destination), target);

        fs.rmSync(destination, { recursive: true, force: true });

        const stats = fs.statSync(resolvedTarget);
        if (stats.isDirectory()) {
          fs.mkdirSync(destination, { recursive: true });
          fs.cpSync(resolvedTarget, destination, { recursive: true });
        } else {
          fs.mkdirSync(path.dirname(destination), { recursive: true });
          fs.copyFileSync(resolvedTarget, destination);
        }
        return destination;
      }
      throw error;
    }
  };
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(adapterOptions),

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
