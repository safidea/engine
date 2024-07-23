import { PostgreSqlContainer } from '@testcontainers/postgresql'

async function globalSetup() {
  const container = await new PostgreSqlContainer().start()
  process.env.TEST_POSTGRES_URL = container.getConnectionUri()
}

export default globalSetup
