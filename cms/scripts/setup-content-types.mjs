#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiRoot = path.join(__dirname, '..', 'src', 'api');

const ensureDir = (targetPath) => {
  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true });
  }
};

const writeJSON = (targetPath, data) => {
  writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

const createCoreFile = (targetPath, factoryCall, uid) => {
  const content = `'use strict';

const { ${factoryCall} } = require('@strapi/strapi').factories;

module.exports = ${factoryCall}('${uid}');
`;
  writeFileSync(targetPath, content, 'utf8');
};

const contentTypes = [
  {
    apiName: 'post',
    schemaName: 'post',
    info: {
      singularName: 'post',
      pluralName: 'posts',
      displayName: 'Post',
      description: 'Blog articles and insights'
    },
    collectionName: 'posts',
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true, unique: true },
      excerpt: { type: 'text' },
      content: { type: 'richtext', required: true },
      featuredImage: {
        type: 'media',
        multiple: false,
        allowedTypes: ['images', 'files', 'videos']
      },
      publishDate: { type: 'datetime', required: true },
      status: {
        type: 'enumeration',
        enum: ['draft', 'published'],
        default: 'draft',
        required: true
      },
      categories: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::category.category',
        inversedBy: 'posts'
      },
      tags: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::tag.tag',
        inversedBy: 'posts'
      },
      author: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::author.author',
        inversedBy: 'posts'
      }
    }
  },
  {
    apiName: 'educational-module',
    schemaName: 'educational-module',
    info: {
      singularName: 'educational-module',
      pluralName: 'educational-modules',
      displayName: 'Educational Module',
      description: 'Learning resources and courses'
    },
    collectionName: 'educational_modules',
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true, unique: true },
      description: { type: 'text' },
      content: { type: 'richtext', required: true },
      mediaAttachments: {
        type: 'media',
        multiple: true,
        allowedTypes: ['images', 'files', 'videos']
      },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::category.category',
        inversedBy: 'educationalModules'
      },
      tags: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::tag.tag',
        inversedBy: 'educationalModules'
      },
      publishDate: { type: 'datetime', required: true },
      status: {
        type: 'enumeration',
        enum: ['draft', 'published'],
        default: 'draft',
        required: true
      },
      author: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::author.author',
        inversedBy: 'educationalModules'
      }
    }
  },
  {
    apiName: 'platform-article',
    schemaName: 'platform-article',
    info: {
      singularName: 'platform-article',
      pluralName: 'platform-articles',
      displayName: 'Platform Article',
      description: 'Platform-specific content (NodeVoyage, Ideonautix)'
    },
    collectionName: 'platform_articles',
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true, unique: true },
      excerpt: { type: 'text' },
      content: { type: 'richtext', required: true },
      featuredImage: {
        type: 'media',
        multiple: false,
        allowedTypes: ['images', 'files', 'videos']
      },
      publishDate: { type: 'datetime', required: true },
      status: {
        type: 'enumeration',
        enum: ['draft', 'published'],
        default: 'draft',
        required: true
      },
      platformType: {
        type: 'enumeration',
        enum: ['NodeVoyage', 'Ideonautix', 'General'],
        default: 'General'
      },
      categories: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::category.category',
        inversedBy: 'platformArticles'
      },
      tags: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::tag.tag',
        inversedBy: 'platformArticles'
      },
      author: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::author.author',
        inversedBy: 'platformArticles'
      }
    }
  },
  {
    apiName: 'category',
    schemaName: 'category',
    info: {
      singularName: 'category',
      pluralName: 'categories',
      displayName: 'Category'
    },
    collectionName: 'categories',
    attributes: {
      name: { type: 'string', required: true, unique: true },
      slug: { type: 'uid', targetField: 'name', required: true, unique: true },
      description: { type: 'text' },
      posts: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::post.post',
        mappedBy: 'categories'
      },
      educationalModules: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::educational-module.educational-module',
        mappedBy: 'category'
      },
      platformArticles: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::platform-article.platform-article',
        mappedBy: 'categories'
      }
    }
  },
  {
    apiName: 'tag',
    schemaName: 'tag',
    info: {
      singularName: 'tag',
      pluralName: 'tags',
      displayName: 'Tag'
    },
    collectionName: 'tags',
    attributes: {
      name: { type: 'string', required: true, unique: true },
      posts: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::post.post',
        mappedBy: 'tags'
      },
      educationalModules: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::educational-module.educational-module',
        mappedBy: 'tags'
      },
      platformArticles: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::platform-article.platform-article',
        mappedBy: 'tags'
      }
    }
  },
  {
    apiName: 'author',
    schemaName: 'author',
    info: {
      singularName: 'author',
      pluralName: 'authors',
      displayName: 'Author'
    },
    collectionName: 'authors',
    attributes: {
      name: { type: 'string', required: true },
      bio: { type: 'text' },
      avatar: {
        type: 'media',
        multiple: false,
        allowedTypes: ['images', 'files']
      },
      email: { type: 'email', unique: true },
      role: { type: 'string' },
      posts: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::post.post',
        mappedBy: 'author'
      },
      educationalModules: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::educational-module.educational-module',
        mappedBy: 'author'
      },
      platformArticles: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::platform-article.platform-article',
        mappedBy: 'author'
      }
    }
  }
];

const main = () => {
  ensureDir(apiRoot);

  for (const type of contentTypes) {
    const apiDir = path.join(apiRoot, type.apiName);
    const contentTypeDir = path.join(apiDir, 'content-types', type.schemaName);
    const controllersDir = path.join(apiDir, 'controllers');
    const routesDir = path.join(apiDir, 'routes');
    const servicesDir = path.join(apiDir, 'services');

    ensureDir(contentTypeDir);
    ensureDir(controllersDir);
    ensureDir(routesDir);
    ensureDir(servicesDir);

    const schemaPath = path.join(contentTypeDir, 'schema.json');
    const schema = {
      kind: 'collectionType',
      collectionName: type.collectionName,
      info: type.info,
      options: {
        draftAndPublish: true
      },
      pluginOptions: {
        'content-manager': {
          visible: true
        }
      },
      attributes: type.attributes
    };
    writeJSON(schemaPath, schema);

    const uid = `api::${type.schemaName}.${type.schemaName}`;
    createCoreFile(path.join(controllersDir, `${type.schemaName}.js`), 'createCoreController', uid);
    createCoreFile(path.join(servicesDir, `${type.schemaName}.js`), 'createCoreService', uid);
    createCoreFile(path.join(routesDir, `${type.schemaName}.js`), 'createCoreRouter', uid);
  }
};

main();
