import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const localesDir = join(process.cwd(), 'src', 'lib', 'i18n');
const baselineLocale = 'en.json';

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

    for (const [path, type] of baselinePaths.entries()) {
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

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log('All locale files are in sync with en.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
