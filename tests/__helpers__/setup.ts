import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

export let container: StartedPostgreSqlContainer

async function globalSetup() {
  container = await new PostgreSqlContainer().start()
  process.env.TEST_POSTGRES_URL = container.getConnectionUri()
}

export default globalSetup
