import { test as baseTest, expect } from '@playwright/test'
import orm from '../app/orm'
import faker from './faker'

const test = baseTest.extend({
  db: async ({}, use) => {
    await use(orm)
  },
  faker: async ({}, use) => {
    await use(faker)
  },
})

test.beforeEach(async ({ db }) => {
  await db.invoice.deleteMany({})
})

test.afterEach(async ({ db }) => {
  await db.invoice.deleteMany({})
})

export { expect, test }
