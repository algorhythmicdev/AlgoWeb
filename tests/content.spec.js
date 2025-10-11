// @ts-nocheck
import { beforeAll, describe, it, expect } from 'vitest';
import fg from 'fast-glob';
import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve('.');
const localeDir = path.join(projectRoot, 'src', 'lib', 'i18n');

let localeFiles = [];
let baseDictionary = {};
let baseKeys = [];
let svelteFiles = [];
const analysisCache = new Map();

beforeAll(async () => {
  localeFiles = await fg('*.json', { cwd: localeDir, absolute: true });
  const basePath = localeFiles.find((file) => file.endsWith('en.json'));
  if (!basePath) {
    throw new Error('Missing base locale en.json');
  }

  baseDictionary = await loadJson(basePath);
  baseKeys = Array.from(flattenKeys(baseDictionary));
  svelteFiles = await fg('src/**/*.svelte', { cwd: projectRoot, absolute: true });
});

async function loadJson(filePath) {
  const file = await readFile(filePath, 'utf8');
  return JSON.parse(file);
}

function flattenKeys(value, prefix = '', result = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPrefix = prefix ? `${prefix}.${index}` : `${index}`;
      flattenKeys(item, nextPrefix, result);
    });
    return result;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      result.add(nextPrefix);
      flattenKeys(child, nextPrefix, result);
    });
    return result;
  }

  return result;
}

function hasTranslation(key, dictionary) {
  return key.split('.').every((segment) => {
    if (segment === '') return true;
    if (dictionary == null) return false;
    if (Array.isArray(dictionary)) {
      const index = Number(segment);
      if (Number.isNaN(index) || index < 0 || index >= dictionary.length) {
        dictionary = undefined;
        return false;
      }
      dictionary = dictionary[index];
      return true;
    }
    if (Object.prototype.hasOwnProperty.call(dictionary, segment)) {
      dictionary = dictionary[segment];
      return true;
    }
    dictionary = undefined;
    return false;
  });
}

function readTranslationValue(key, dictionary) {
  return key.split('.').reduce((current, segment) => {
    if (!segment || current == null) return undefined;
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (Number.isNaN(index)) return undefined;
      return current[index];
    }
    return current?.[segment];
  }, dictionary);
}

function extractLiteralKey(argument) {
  if (!argument) return undefined;
  if (argument.type === 'Literal' && typeof argument.value === 'string') {
    return argument.value;
  }
  if (argument.type === 'TemplateLiteral' && argument.expressions.length === 0) {
    return argument.quasis.map((q) => q.value.cooked).join('');
  }
  return undefined;
}

const TRANSLATION_CALLEES = new Set(['_', '$_', '$format', '$formatMessage', '$t']);

function isTranslationCallee(callee) {
  if (!callee) return false;
  if (callee.type === 'Identifier') {
    return TRANSLATION_CALLEES.has(callee.name);
  }
  if (callee.type === 'MemberExpression' && !callee.computed && callee.property?.type === 'Identifier') {
    return TRANSLATION_CALLEES.has(callee.property.name);
  }
  return false;
}

function collectTranslationKeys(ast) {
  const keys = new Set();
  const inspect = (node) => {
    if (!node) return;

    if (node.type === 'CallExpression' && isTranslationCallee(node.callee)) {
      const key = extractLiteralKey(node.arguments?.[0]);
      if (key && !key.includes('${')) {
        keys.add(key.trim());
      }
    }

    if (node.type === 'ChainExpression' && node.expression?.type === 'CallExpression') {
      const call = node.expression;
      if (isTranslationCallee(call.callee)) {
        const key = extractLiteralKey(call.arguments?.[0]);
        if (key && !key.includes('${')) {
          keys.add(key.trim());
        }
      }
    }
  };

  if (ast.instance) {
    walk(ast.instance, {
      enter(node) {
        inspect(node);
      }
    });
  }

  if (ast.module) {
    walk(ast.module, {
      enter(node) {
        inspect(node);
      }
    });
  }

  walk(ast.html, {
    enter(node) {
      inspect(node);
    }
  });

  return Array.from(keys);
}

function collectUnkeyedText(ast, filePath) {
  const issues = [];
  const stack = [];

  function visit(node, parent) {
    if (!node) return;
    stack.push(node);

    if (node.type === 'Text') {
      const trimmed = node.data.replace(/\s+/g, ' ').trim();
      const parentNode = parent;
      const parentType = parentNode?.type;
      const grandParentType = stack.length > 2 ? stack[stack.length - 3]?.type : undefined;

      const ignoredParent = parentType && ['Attribute', 'Style', 'Script'].includes(parentType);
      const insideStyleElement = parentType === 'Element' && parentNode?.name === 'style';
      const insideScriptElement = parentType === 'Element' && parentNode?.name === 'script';
      const insideTitle = parentType === 'Element' && parentNode?.name === 'title';
      const insideSvelteHead = parentType === 'Element' && parentNode?.name === 'svelte:head';

      if (!trimmed || ignoredParent || insideStyleElement || insideScriptElement || insideTitle || insideSvelteHead) {
        stack.pop();
        return;
      }

      if (/^[\s.,:;!?()\-–—/]+$/.test(trimmed)) {
        stack.pop();
        return;
      }

      if (grandParentType === 'RawMustacheTag') {
        stack.pop();
        return;
      }

      issues.push({ file: filePath, text: trimmed });
      stack.pop();
      return;
    }

    const children = [];
    if (Array.isArray(node.children)) {
      children.push(...node.children.map((child) => [child, node]));
    }

    if (node.type === 'IfBlock') {
      if (node.then) {
        children.push([node.then, node]);
      }
      if (node.else) {
        children.push([node.else, node]);
      }
    }

    if (node.type === 'EachBlock') {
      if (node.body) {
        children.push([node.body, node]);
      }
      if (node.else) {
        children.push([node.else, node]);
      }
    }

    if (node.type === 'PendingBlock') {
      if (node.then) {
        children.push([node.then, node]);
      }
      if (node.catch) {
        children.push([node.catch, node]);
      }
    }

    if (node.type === 'AwaitBlock') {
      if (node.pending) {
        children.push([node.pending, node]);
      }
      if (node.then) {
        children.push([node.then, node]);
      }
      if (node.catch) {
        children.push([node.catch, node]);
      }
    }

    if (Array.isArray(node.values)) {
      node.values.forEach((value) => {
        if (value && typeof value === 'object') {
          children.push([value, node]);
        }
      });
    }

    if (node.expression && typeof node.expression === 'object') {
      children.push([node.expression, node]);
    }

    children.forEach(([child, parentNode]) => visit(child, parentNode));
    stack.pop();
  }

  visit(ast.html, null);
  return issues;
}

async function analyzeSvelteFile(filePath) {
  if (analysisCache.has(filePath)) {
    return analysisCache.get(filePath);
  }

  const source = await readFile(filePath, 'utf8');
  const ast = parse(source);
  const relative = path.relative(projectRoot, filePath);
  const analysis = {
    keys: collectTranslationKeys(ast),
    unkeyed: collectUnkeyedText(ast, relative)
  };
  analysisCache.set(filePath, analysis);
  return analysis;
}

describe('localization hygiene', () => {
  it('all locales contain the base translation keys', async () => {
    for (const file of localeFiles) {
      if (file.endsWith('en.json')) continue;
      const dictionary = await loadJson(file);
      const missing = baseKeys.filter((key) => !hasTranslation(key, dictionary));
      expect(missing, `${path.basename(file)} is missing keys`).toEqual([]);
    }
  });

  it('localizes consulting form helper text in every language', async () => {
    const helperKeys = [
      'form.helper_company',
      'form.helper_name',
      'form.helper_email',
      'form.helper_phone',
      'form.helper_industry',
      'form.helper_description'
    ];

    for (const file of localeFiles) {
      const dictionary = await loadJson(file);
      for (const key of helperKeys) {
        const value = readTranslationValue(key, dictionary);
        expect(typeof value).toBe('string');
        expect(String(value).trim().length, `${path.basename(file)} missing value for ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('all referenced translation keys exist in the base dictionary', async () => {
    const missingEntries = [];

    for (const file of svelteFiles) {
      const { keys } = await analyzeSvelteFile(file);
      const fileMissing = keys.filter((key) => !hasTranslation(key, baseDictionary));
      if (fileMissing.length) {
        missingEntries.push({ file: path.relative(projectRoot, file), keys: fileMissing });
      }
    }

    expect(missingEntries).toEqual([]);
  });
});

describe('content hygiene', () => {
  it('contains no unkeyed visible text nodes', async () => {
    const issues = [];

    for (const file of svelteFiles) {
      const { unkeyed } = await analyzeSvelteFile(file);
      if (unkeyed.length) {
        issues.push(...unkeyed);
      }
    }

    expect(issues).toEqual([]);
  });
});
