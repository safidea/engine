import { test as baseTest, expect } from '@playwright/test'
import orm from '../app/orm'

const test = baseTest.extend({
  db: async ({}, use) => {
    await use(orm)
  },
})

test.afterEach(async ({ db }) => {
  await db.invoice.deleteMany({})
})

export { expect, test }
