
import fs from 'fs';
import path from 'path';

const I18N_DIR = 'src/lib/i18n';
const EN_FILE = path.join(I18N_DIR, 'en.json');
const ES_FILE = path.join(I18N_DIR, 'es.json');

const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

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


const enData = readJsonFile(EN_FILE);
const esData = readJsonFile(ES_FILE);

const enKeys = Array.from(flattenKeys(enData));
const missing = enKeys.filter((key) => !hasTranslation(key, esData));

console.log(missing);
