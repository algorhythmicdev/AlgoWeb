import fs from 'fs';
import path from 'path';

export default ({ env }) => {
  const connectionName = env('CLOUDSQL_CONNECTION_NAME');
  const socketHost = connectionName ? `/cloudsql/${connectionName}` : null;

  const hasPostgresConfig =
    Boolean(connectionName) ||
    Boolean(env('DATABASE_HOST')) ||
    Boolean(env('DATABASE_URL')) ||
    Boolean(env('DATABASE_USERNAME'));

  if (!hasPostgresConfig) {
    const sqliteDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(sqliteDir)) {
      fs.mkdirSync(sqliteDir, { recursive: true });
    }
    const sqliteFilename = path.join(sqliteDir, 'sqlite.db');

    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: sqliteFilename,
        },
        useNullAsDefault: true,
      },
    };
  }

  const connection = socketHost
    ? {
        host: socketHost,
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
