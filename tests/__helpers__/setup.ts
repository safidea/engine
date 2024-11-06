import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

export let container: StartedPostgreSqlContainer

async function globalSetup() {
  const isUnitTest = process.argv.includes('tests/unit')
  if (isUnitTest) return
  container = await new PostgreSqlContainer().start()
  process.env.TEST_POSTGRES_URL = container.getConnectionUri()
}

export default globalSetup
