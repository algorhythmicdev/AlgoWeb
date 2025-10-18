export default ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 8080),
  url: env('URL'),
  app: { keys: env.array('APP_KEYS') },
});
