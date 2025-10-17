/**
 * CMS Content Type Definitions (Phase 2)
 * TypeScript/JSDoc interfaces for Strapi content types
 */

/**
 * @typedef {'draft' | 'published'} ContentStatus
 */

/**
 * @typedef {Object} StrapiImage
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} [alternativeText]
 * @property {string} [caption]
 * @property {number} width
 * @property {number} height
 * @property {Object} formats
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Tag
 * @property {number} id
 * @property {string} name
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Author
 * @property {number} id
 * @property {string} name
 * @property {string} [bio]
 * @property {StrapiImage} [avatar]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Blog Post content type (Phase 2 - Content Modeling)
 * @typedef {Object} BlogPost
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [excerpt]
 * @property {string} content - Rich text/Markdown content
 * @property {StrapiImage} [featuredImage]
 * @property {string} publishDate
 * @property {ContentStatus} status
 * @property {Category[]} [categories]
 * @property {Tag[]} [tags]
 * @property {Author} [author]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [publishedAt]
 */

/**
 * Educational Module content type (Phase 2 - Content Modeling)
 * @typedef {Object} EducationalModule
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [description]
 * @property {string} content - Rich text content
 * @property {StrapiImage[]} [mediaAttachments]
 * @property {Category} [category]
 * @property {Tag[]} [tags]
 * @property {string} publishDate
 * @property {ContentStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [publishedAt]
 */

/**
 * User authentication response (Phase 3)
 * @typedef {Object} AuthResponse
 * @property {string} jwt
 * @property {User} user
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} [provider]
 * @property {boolean} confirmed
 * @property {boolean} blocked
 * @property {Object} [role]
 */

/**
 * Strapi API response wrapper
 * @template T
 * @typedef {Object} StrapiResponse
 * @property {T | T[]} data
 * @property {Object} [meta]
 */

/**
 * API Error response
 * @typedef {Object} APIError
 * @property {number} status
 * @property {string} name
 * @property {string} message
 * @property {Object} [details]
 */

export {};
