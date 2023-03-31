import { faker } from '@faker-js/faker'
import { ConfigService } from 'foundation-common'
import { Database, DatabaseSetup } from '../src'

import type { Data, Row, Config } from '../types'

let row: Row
let table: string
const newData = (): Data => ({
  stringField: faker.helpers.unique(faker.name.firstName),
  integerField: faker.datatype.number(),
})

beforeAll(async () => {
  const { tables } = (await ConfigService.get()) as Config
  table = Object.keys(tables)[0]
  await DatabaseSetup()
})

test('should create a row in a table', async () => {
  row = await Database(table).create(newData())
  expect(row).toHaveProperty('id')
})

test('should patch a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database(table).patchById(row.id, { ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should put a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database(table).putById(row.id, { ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should upsert a new row in a table', async () => {
  row = await Database(table).upsertById('', newData())
  expect(row).toHaveProperty('id')
})

test('should upsert an existing row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database(table).upsertById(row.id, { ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should get a row in a table', async () => {
  const foundRow = await Database(table).readById(row.id)
  expect(foundRow.id).toBe(row.id)
})

test('should get all rows in a table', async () => {
  const rows = await Database(table).list()
  expect(rows).toHaveLength(2)
})

test('should delete a row in a table', async () => {
  const deletedRow = await Database(table).deleteById(row.id)
  expect(deletedRow).toHaveProperty('id')
})
