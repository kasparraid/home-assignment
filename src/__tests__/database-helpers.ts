import {juggler} from '@loopback/repository';

export async function givenTestDataSource() {
  return new juggler.DataSource({
    name: 'pgdb',
    connector: 'postgresql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    lazyConnect: true,
  });
}
