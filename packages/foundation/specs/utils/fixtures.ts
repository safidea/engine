import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import { FoundationHelper } from './FoundationHelper'
import * as helpers from './helpers'

const log = debug('foundation:specs')

interface Fixtures {
  port: number
  foundation: FoundationHelper
}

const test = base.extend<Fixtures>({
  foundation: async ({}, use) => {
    const foundation = new FoundationHelper()
    await use(foundation)
  },
  baseURL: async ({ foundation }, use) => {
    const { url, port } = await foundation.start()
    log(`Starting foundation app on port ${port}`)
    await use(url)
  },
})

test.beforeEach(async ({ page }) => {
  page.on('console', (message) => {
    log(`Browser console: ${message.text()}`)
  })
  page.on('request', (request) => {
    log(`Request: ${request.url()}`)
  })
  page.on('response', (response) => {
    log(`Response: ${response.url()} Status: ${response.status()}`)
  })
})

export { test, expect, helpers }
