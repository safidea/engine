import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import * as helpers from './helpers'
import { getDedicatedTmpFolder } from '../helpers'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import Foundation from '../../../src/Foundation'
import { FileStorage } from '@infrastructure/storage/FileStorage'

const log = debug('foundation:specs')

interface Fixtures {
  folder: string
  orm: JsonOrm
  storage: FileStorage
}

const test = base.extend<Fixtures>({
  folder: async ({}, use) => {
    const folder = getDedicatedTmpFolder()
    await use(folder)
  },
  orm: async ({ folder }, use) => {
    const orm = new JsonOrm(folder)
    await use(orm)
  },
  storage: async ({ folder }, use) => {
    const storage = new FileStorage(folder)
    await use(storage)
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
