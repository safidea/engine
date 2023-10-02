import debug from 'debug'
import { test, expect } from '@playwright/test'
import * as helpers from './helpers'

const log = debug('engine:specs')

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
