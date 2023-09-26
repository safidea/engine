import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import * as helpers from './helpers'
import { getDedicatedTmpFolder } from '../helpers'
import Engine from '../../src/server'

const log = debug('engine:specs')

interface Fixtures {
  folder: string
}

const test = base.extend<Fixtures>({
  folder: async ({}, use) => {
    const folder = getDedicatedTmpFolder()
    await use(folder)
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

export { test, expect, helpers, Engine }
