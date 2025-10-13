// @ts-nocheck
import { describe, it, expect } from 'vitest';
import fg from 'fast-glob';
import { readFile } from 'node:fs/promises';
import { parse } from 'svelte/compiler';

/**
 * Collect literal text nodes that contain visible characters (letters, digits)
 * and are not wrapped in translation helpers.
 */
function collectLiteralText(ast, source, issues, parentType = '', parentKey = '') {
  if (!ast || typeof ast !== 'object') {
    return;
  }

  if (Array.isArray(ast)) {
    for (const child of ast) {
      collectLiteralText(child, source, issues, parentType, parentKey);
    }
    return;
  }

  if (ast.type === 'Text') {
    const value = ast.data;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed && parentKey === 'children' && parentType && parentType !== 'Attribute') {
        if (/[A-Za-zÀ-ÖØ-öø-ÿ0-9]/.test(trimmed)) {
          const location = indexToPosition(source, ast.start ?? 0);
          issues.push({ text: trimmed, location });
        }
      }
    }
  }

  for (const [key, child] of Object.entries(ast)) {
    if (key === 'parent') continue;
    if (Array.isArray(child)) {
      for (const value of child) {
        collectLiteralText(value, source, issues, ast.type, key);
      }
      continue;
    }
    if (child && typeof child === 'object') {
      collectLiteralText(child, source, issues, ast.type, key);
    }
  }
}

function indexToPosition(source, index) {
  const preceding = source.slice(0, index);
  const lines = preceding.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

describe('i18n hygiene', () => {
  it('does not contain unkeyed literal text in Svelte templates', async () => {
    const files = await fg(['src/**/*.svelte'], {
      ignore: ['**/node_modules/**', '**/.svelte-kit/**']
    });

    /** @type {Array<{file: string; text: string; location: { line: number; column: number }}>} */
    const issues = [];

    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const ast = parse(source);
      const fileIssues = [];
      collectLiteralText(ast.html, source, fileIssues);

      for (const issue of fileIssues) {
        issues.push({ file, ...issue });
      }
    }

    const message = issues
      .map((issue) => `${issue.file}:${issue.location.line}:${issue.location.column} → ${issue.text}`)
      .join('\n');

    expect(issues, message || 'No stray text nodes').toEqual([]);
  });
});
