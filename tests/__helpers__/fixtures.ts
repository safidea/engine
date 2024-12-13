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

const {
  TEST_NOTION_TOKEN,
  TEST_NOTION_TABLE_1_ID,
  TEST_NOTION_TABLE_2_ID,
  TEST_PAPPERS_API_KEY,
  TEST_QONTO_ORGANISATION_SLUG,
  TEST_QONTO_SECRET_KEY,
  TEST_QONTO_STAGING_TOKEN,
} = process.env

if (!TEST_NOTION_TOKEN) throw new Error('TEST_NOTION_TOKEN env var is not defined')
if (!TEST_NOTION_TABLE_1_ID) throw new Error('TEST_NOTION_TABLE_1_ID env var is not defined')
if (!TEST_NOTION_TABLE_2_ID) throw new Error('TEST_NOTION_TABLE_2_ID env var is not defined')
if (!TEST_PAPPERS_API_KEY) throw new Error('TEST_PAPPERS_API_KEY env var is not defined')
if (!TEST_QONTO_ORGANISATION_SLUG)
  throw new Error('TEST_QONTO_ORGANISATION_SLUG env var is not defined')
if (!TEST_QONTO_SECRET_KEY) throw new Error('TEST_QONTO_SECRET_KEY env var is not defined')
if (!TEST_QONTO_STAGING_TOKEN) throw new Error('TEST_QONTO_STAGING_TOKEN env var is not defined')

export const env = {
  TEST_NOTION_TOKEN,
  TEST_NOTION_TABLE_1_ID,
  TEST_NOTION_TABLE_2_ID,
  TEST_PAPPERS_API_KEY,
  TEST_QONTO_ORGANISATION_SLUG,
  TEST_QONTO_SECRET_KEY,
  TEST_QONTO_STAGING_TOKEN,
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
