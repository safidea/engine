import {
  test as base,
  expect,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  type TestType,
} from '@playwright/test'
import Logger from '@tests/logger'

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

export { expect }
