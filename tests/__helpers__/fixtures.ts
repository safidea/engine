import {
  test as base,
  expect,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  type TestType,
} from '@playwright/test'
import Logger from '@tests/drivers/logger'

export type Test = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>

const { TEST_NOTION_TOKEN, TEST_NOTION_TABLE_ID } = process.env

if (!TEST_NOTION_TOKEN) throw new Error('TEST_NOTION_TOKEN env var is not defined')
if (!TEST_NOTION_TABLE_ID) throw new Error('TEST_NOTION_TABLE_ID env var is not defined')

export const env = {
  TEST_NOTION_TOKEN,
  TEST_NOTION_TABLE_ID,
}

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
