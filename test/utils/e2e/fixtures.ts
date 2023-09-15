import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import Engine from '../../../src'
import * as helpers from './helpers'
import { getDedicatedTmpFolder } from '../helpers'
import { JsonOrm } from '@drivers/database/JsonDatabase'
import { FileStorage } from '@drivers/storage/FileStorage'
import { Converter } from '@drivers/converter/Converter'

const log = debug('engine:specs')

interface Fixtures {
  folder: string
  orm: JsonOrm
  storage: FileStorage
  converter: Converter
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
    const storage = new FileStorage(folder, 'http://localhost:3000')
    await use(storage)
  },
  converter: async ({ folder }, use) => {
    const converter = new Converter(folder)
    await use(converter)
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
