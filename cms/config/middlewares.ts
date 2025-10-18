export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://algorhythmics.dev', 'https://*.vercel.app', 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
