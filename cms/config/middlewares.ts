export default ({ env }) => [
  'strapi::errors',

  // 👇 Add this early so all downstream middlewares see a secure request
  { name: 'global::https-proxy' },
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
      origin: [
        'https://algorhythmics.dev',
        'https://cms.algorhythmics.dev',
        'https://*.vercel.app',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  {
    name: 'strapi::session',
    config: {
      key: 'koa.sess',
      rolling: false,
      renew: false,
      // We keep your toggle but also allow secure via proxy
      secure: env('SESSION_COOKIE_SECURE') === 'true',
      secureProxy: true,
      sameSite: 'lax',
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
