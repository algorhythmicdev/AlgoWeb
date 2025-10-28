import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import fg from 'fast-glob';

const localesDir = join(process.cwd(), 'src', 'lib', 'translations');
const baselineLocale = 'en.json';
const MINIMAL_KEYS = [
  'nav.home',
  'nav.team',
  'nav.ideonautix',
  'nav.nodevoyage',
  'nav.consulting',
  'nav.education',
  'nav.contact',
  'cta.primary',
  'cta.secondary',
  'common.loading',
  'common.close'
];

const PARTIAL_LOCALE_KEYS = new Map([
  ['lv.json', MINIMAL_KEYS],
  ['ru.json', MINIMAL_KEYS],
  // New languages with empty requirements - fall back to English
  ['uk.json', []],
  ['fr.json', []],
  ['es.json', []]
]);

/**
 * @param {unknown} value
 * @param {string} prefix
 * @param {Map<string, string>} paths
 */
function collectPaths(value, prefix, paths) {
  if (Array.isArray(value)) {
    if (prefix) {
      paths.set(prefix, 'array');
    }
    return;
  }

  if (value && typeof value === 'object') {
    if (prefix) {
      paths.set(prefix, 'object');
    }

    for (const [key, val] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      collectPaths(val, nextPrefix, paths);
    }
    return;
  }

  paths.set(prefix, typeof value);
}

/**
 * @param {string} localePath
 */
async function loadLocale(localePath) {
  const file = await readFile(localePath, 'utf8');
  return JSON.parse(file);
}

async function main() {
  const files = await readdir(localesDir);
  if (!files.includes(baselineLocale)) {
    throw new Error(`Baseline locale ${baselineLocale} not found in ${localesDir}`);
  }

  const baseline = await loadLocale(join(localesDir, baselineLocale));
  const baselinePaths = new Map();
  collectPaths(baseline, '', baselinePaths);

  const usedKeys = await extractUsedTranslationKeys();
  const missingInBaseline = [...usedKeys].filter((key) => !baselinePaths.has(key));

  /** @type {string[]} */
  const failures = [];

  for (const file of files.filter((name) => name.endsWith('.json') && name !== baselineLocale)) {
    const localeData = await loadLocale(join(localesDir, file));
    const localePaths = new Map();
    collectPaths(localeData, '', localePaths);

    /** @type {string[]} */
    const missing = [];
    /** @type {string[]} */
    const mismatched = [];

    const requiredKeys = PARTIAL_LOCALE_KEYS.get(file);
    const entries = requiredKeys
      ? requiredKeys
          .map((path) => [path, baselinePaths.get(path)])
          .filter(([, type]) => typeof type !== 'undefined')
      : [...baselinePaths.entries()];

    for (const [path, type] of entries) {
      if (!localePaths.has(path)) {
        missing.push(path);
        continue;
      }

      const otherType = localePaths.get(path);
      if (otherType !== type) {
        mismatched.push(`${path} (expected ${type}, received ${otherType})`);
      }
    }

    if (missing.length || mismatched.length) {
      failures.push(`Locale ${file} is out of sync. Missing keys: ${missing.join(', ') || 'none'}. Type mismatches: ${mismatched.join(', ') || 'none'}.`);
    }
  }

  if (missingInBaseline.length) {
    failures.unshift(
      `Missing translation keys in ${baselineLocale}: ${missingInBaseline
        .map((key) => `'${key}'`)
        .join(', ')}`
    );
  }

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log('All locale files are in sync with en.json');
}

async function extractUsedTranslationKeys() {
  const patterns = [
    /(?:\$_|\b_)\(\s*['"]([^'"$]+)['"]\s*/g,
    /\$json\?\.\(\s*['"]([^'"$]+)['"]\s*\)/g,
    /\$json\?\.\(\s*`([^`$]+)`\s*\)/g,
    // Pattern to match t() function calls from new i18n system (e.g., t('nav.home'))
    /\bt\(\s*['"]([^'"$]+)['"]\s*/g
  ];

  const files = await fg(['src/**/*.{svelte,js,ts}'], {
    ignore: ['**/node_modules/**', '**/.svelte-kit/**', '**/dist/**'],
    dot: false
  });

  const used = new Set();

  await Promise.all(
    files.map(async (file) => {
      const fullPath = join(process.cwd(), file);
      const content = await readFile(fullPath, 'utf8');

      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(content))) {
          const key = match[1].trim();
          if (!key || key.includes('${')) continue;
          used.add(key);
        }
      }
    })
  );

  return used;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
