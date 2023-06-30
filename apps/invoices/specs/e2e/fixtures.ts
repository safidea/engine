import { test as baseTest, expect } from '@playwright/test'
import orm from '../../app/orm'
import faker from '../faker'

const test = baseTest.extend({
  db: async ({}, use) => {
    await use(orm)
  },
  faker: async ({}, use) => {
    await use(faker)
  },
})

test.beforeEach(async ({ page, db }) => {
  await db.invoice.deleteMany({})

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

test.afterEach(async ({ db }) => {
  await db.invoice.deleteMany({})
})

export { expect, test }
