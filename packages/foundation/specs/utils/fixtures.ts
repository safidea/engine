import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import { FoundationHelper } from './FoundationHelper'
import * as helpers from './helpers'

interface Fixtures {
  port: number
  foundation: FoundationHelper
}

const test = base.extend<Fixtures>({
  port: async ({}, use) => {
    const freePort = await helpers.findAvailablePort()
    await use(freePort)
  },
  baseURL: async ({ port }, use) => {
    const baseURL = `http://localhost:${port}`
    await use(baseURL)
  },
  foundation: async ({ port }, use) => {
    const app = new FoundationHelper(port)
    await use(app)
  },
})

const log = debug('specs:playwright')

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
