import { test as baseTest, expect } from '@playwright/test'
import orm from '../../app/orm'
import faker from '../faker'

const test = baseTest.extend({
  orm: async ({}, use) => {
    await use(orm)
  },
  faker: async ({}, use) => {
    await use(faker)
  },
})

test.beforeAll(async ({ orm }) => {
  await orm.invoice.deleteMany({})
})

test.beforeEach(async ({ page, orm }) => {
  await orm.invoice.deleteMany({})

  page.on('console', (message) => {
    console.log(`Browser console: ${message.text()}`)
  })

  // Log all network requests
  page.on('request', (request) => {
    console.log(`Request: ${request.url()}`)
  })

  // Log all network responses
  page.on('response', (response) => {
    console.log(`Response: ${response.url()} Status: ${response.status()}`)
  })
})

test.afterEach(async ({ orm }) => {
  await orm.invoice.deleteMany({})
})

test.afterAll(async ({ orm }) => {
  await orm.invoice.deleteMany({})
})

export { expect, test }
