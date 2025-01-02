import {
  test as base,
  expect,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  type TestType,
} from '@playwright/test'
import Logger from '@test/drivers/logger'
import env from '@test/env'
import type { TestRunnerIntegration } from './runner'
import App from '@latechforce/engine'
import { drivers } from '@latechforce/engine/node'

export class NodeApp extends App {
  constructor() {
    super({ drivers })
  }
}

export type Test = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>

export const test: Test = base.extend({
  page: async ({ page }, use) => {
    const logger = new Logger()
    page.on('pageerror', async (exception) => {
      logger.debug(`page error: ${exception.message}`)
    })
    page.on('console', async (msg) => {
      logger.debug(`page console: ${msg.text()}`)
    })
    await use(page)
  },
})

console.info = function () {
  // do nothing
}

export const runner: TestRunnerIntegration = {
  test,
  describe: test.describe,
  it: test,
  expect,
  beforeAll: test.beforeAll,
  beforeEach: test.beforeEach,
  afterAll: test.afterAll,
  afterEach: test.afterEach,
  slow: test.slow,
  env: {},
  isIntegration: true,
}

export { expect, env }
