import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const I18N_DIR = 'src/lib/i18n';
const EN_FILE = path.join(I18N_DIR, 'en.json');
const TARGET_LANGS = ['es', 'fr', 'lv', 'ru', 'uk'];

const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
};

const syncTranslations = () => {
  const enData = readJsonFile(EN_FILE);

  TARGET_LANGS.forEach((lang) => {
    const langFile = path.join(I18N_DIR, `${lang}.json`);
    const langData = readJsonFile(langFile);

    const newLangData = _.mergeWith({}, enData, langData, (objValue, srcValue) => {
      if (_.isObject(objValue) && !_.isArray(objValue)) {
        return;
      }
      if (srcValue === undefined || srcValue === null) {
        return `[TODO: TRANSLATE] ${objValue}`;
      }
      return srcValue;
    });

    writeJsonFile(langFile, newLangData);
    console.log(`Synced ${langFile}`);
  });
};

syncTranslations();
