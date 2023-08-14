import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import * as helpers from './helpers'
import { getDedicatedTmpFolder } from '../helpers'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import Foundation from '../../../src/Foundation'

const log = debug('foundation:specs')

interface Fixtures {
  folder: string
  orm: InMemoryOrm
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
