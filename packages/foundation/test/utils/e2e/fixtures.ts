import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import * as recordHelpers from '../helpers/record'
import * as schemaHelpers from '../helpers/schema'
import { getDedicatedTmpFolder } from '../helpers/tmp'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import Foundation from '../../../src/Foundation'

const log = debug('foundation:specs')

const helpers = {
  ...recordHelpers,
  ...schemaHelpers,
}

interface Fixtures {
  folder: string
  orm: InMemoryOrm
  url: (port: number, path: string) => string
}

const test = base.extend<Fixtures>({
  folder: async ({}, use) => {
    const folder = getDedicatedTmpFolder()
    await use(folder)
  },
  orm: async ({ folder }, use) => {
    const orm = new InMemoryOrm(folder)
    await use(orm)
  },
  url: async ({}, use) => {
    const url = (port: number, path: string) => `http://localhost:${port}${path}`
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

export { test, expect, helpers, Foundation }
