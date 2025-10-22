import { readFileSync, writeFileSync } from 'fs';

const en = JSON.parse(readFileSync('src/lib/translations/en.json', 'utf8'));
const uk = JSON.parse(readFileSync('src/lib/translations/uk.json', 'utf8'));

const rows = [];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function flatten(path, enValue, ukValue) {
  if (Array.isArray(enValue) || Array.isArray(ukValue)) {
    const enArray = Array.isArray(enValue) ? enValue : [];
    const ukArray = Array.isArray(ukValue) ? ukValue : [];
    const maxLength = Math.max(enArray.length, ukArray.length);

    for (let index = 0; index < maxLength; index += 1) {
      const nextPath = path ? `${path}[${index}]` : `[${index}]`;
      flatten(nextPath, enArray[index], ukArray[index]);
    }

    return;
  }

  if (isPlainObject(enValue) || isPlainObject(ukValue)) {
    const enObject = isPlainObject(enValue) ? enValue : {};
    const ukObject = isPlainObject(ukValue) ? ukValue : {};
    const keys = new Set([...Object.keys(enObject), ...Object.keys(ukObject)]);

    for (const key of Array.from(keys).sort()) {
      const nextPath = path ? `${path}.${key}` : key;
      flatten(nextPath, enObject[key], ukObject[key]);
    }

    return;
  }

  const keyPath = path || '(root)';

  rows.push({
    key: keyPath,
    en: formatValue(enValue),
    uk: formatValue(ukValue)
  });
}

function formatValue(value) {
  if (value === undefined) return '';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'string') {
    return escapeMarkdown(value);
  }

  return escapeMarkdown(JSON.stringify(value));
}

function escapeMarkdown(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

flatten('', en, uk);

rows.sort((a, b) => a.key.localeCompare(b.key));

const header = `# English ↔ Ukrainian translation reference\n\n` +
  `This document merges every key from \`en.json\` with the current \`uk.json\`. ` +
  `Each row lists the English source string alongside the Ukrainian translation. ` +
  `Empty Ukrainian values highlight strings still needing localisation. ` +
  `The table is sorted alphabetically by key so translators can quickly scan related phrases grouped together.\n\n` +
  `| Key | English | Ukrainian |\n` +
  `| --- | --- | --- |\n`;

const markdown = header + rows.map((row) => `| \`${row.key}\` | ${row.en} | ${row.uk} |`).join('\n') + '\n';

writeFileSync('doc/translations/en-uk-reference.md', markdown);
