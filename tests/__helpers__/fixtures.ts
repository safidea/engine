import {
  test as base,
  expect,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  type TestType,
} from '@playwright/test'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import Logger from '@tests/logger'

let postgresUrl: string
let container: StartedPostgreSqlContainer

export type Fixtures = {
  postgresUrl: string
}

export type Test = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & Fixtures,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>

export const test: Test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    const logger = new Logger()
    const log = logger.init('[test]:browser')
    page.on('pageerror', async (exception) => {
      log(exception.message)
    })
    page.on('console', async (msg) => {
      log(msg.text())
    })
    await use(page)
  },
  // eslint-disable-next-line no-empty-pattern
  postgresUrl: async ({}, use) => {
    await use(postgresUrl)
  },
})

test.beforeAll(async () => {
  container = await new PostgreSqlContainer().start()
  postgresUrl = container.getConnectionUri()
})

test.afterAll(async () => {
  await container.stop()
})

export { expect }
