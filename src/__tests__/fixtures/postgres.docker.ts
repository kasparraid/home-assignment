import {PostgreSqlContainer, StartedPostgreSqlContainer} from 'testcontainers';

async function startPostgresContainer() {
  if (process.env.DB_HOST != null) return;
  const container = await new PostgreSqlContainer()
    .withExposedPorts(5432)
    .withDatabase('decks')
    .withUsername('postgres')
    .withPassword('postgres')
    .withCopyFileToContainer(
      './migrations/20221001180000-init.sql',
      '/docker-entrypoint-initdb.d/init.sql',
    )
    .start();
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getMappedPort(5432).toString();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_DATABASE = container.getDatabase();
  return container;
}

let startedContainer: StartedPostgreSqlContainer | undefined;

/**
 * Root-level before hook to start Postgres container
 */
before(async () => {
  startedContainer = await startPostgresContainer();
});

/**
 * Root-level before hook to stop Postgres container
 */
after(async () => {
  await startedContainer?.stop();
});
