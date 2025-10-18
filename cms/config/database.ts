export default ({ env }) => {
  const connectionName = env('CLOUDSQL_CONNECTION_NAME');
  const socketHost = connectionName ? `/cloudsql/${connectionName}` : null;

  const connection = socketHost
    ? {
        host: socketHost, // Cloud Run mounts the Cloud SQL Unix socket here
        database: env('DATABASE_NAME', 'strapidb'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD'),
        port: 5432,
        ssl: false,
      }
    : {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapidb'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false),
      };

  return {
    connection: {
      client: 'postgres',
      connection,
    },
  };
};
