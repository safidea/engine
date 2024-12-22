import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

export let container: StartedPostgreSqlContainer

async function globalSetup() {
  const isUnitTest = process.argv.includes('test/unit')
  const isIntegrationTest = process.argv.includes('test/integration')
  if (isUnitTest || isIntegrationTest) return
  container = await new PostgreSqlContainer().start()
  process.env.TEST_POSTGRES_URL = container.getConnectionUri()
}

export default globalSetup
