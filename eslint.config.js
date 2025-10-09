import js from '@eslint/js';
import globals from 'globals';
import pluginSvelte from 'eslint-plugin-svelte';
import tsParser from '@typescript-eslint/parser';

const jsConfig = {
  ...js.configs.recommended,
  files: ['**/*.js'],
  languageOptions: {
    ...js.configs.recommended.languageOptions,
    sourceType: 'module',
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...(js.configs.recommended.languageOptions?.globals ?? {})
    }
  }
};

const svelteRecommended = pluginSvelte.configs['flat/recommended'].map((config) => ({
  ...config,
  files: ['**/*.svelte'],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      parser: {
        ...(config.languageOptions?.parserOptions?.parser ?? {}),
        ts: tsParser
      },
      extraFileExtensions: ['.svelte']
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...(config.languageOptions?.globals ?? {})
    }
  }
}));

const sveltePrettier = pluginSvelte.configs['flat/prettier'].map((config) => ({
  ...config,
  files: ['**/*.svelte']
}));

export default [
  {
    ignores: ['build/', '.svelte-kit/', '.vercel/', 'static/_app/', 'dist/', 'package/', 'node_modules/']
  },
  jsConfig,
  ...svelteRecommended,
  ...sveltePrettier,
  {
    files: ['**/*.svelte'],
    rules: {
      'svelte/no-at-html-tags': 'off'
    }
  }
];
