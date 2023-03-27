import { faker } from '@faker-js/faker'

import * as Database from '../src'
import { Data, Row } from '../types'

let row: Row
const newData = (): Data => ({
  stringField: faker.helpers.unique(faker.name.firstName),
  integerField: faker.datatype.number(),
})

test('should return null if the table does not exist', async () => {
  try {
    await Database.create('non-existent-table', newData())
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Table non-existent-table does not exist')
  }
})

test('should create a row in a table', async () => {
  row = await Database.create('tableName', newData())
  expect(row).toHaveProperty('id')
})

test('should update a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database.update('tableName', { ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should upsert a new row in a table', async () => {
  row = await Database.upsert('tableName', newData())
  expect(row).toHaveProperty('id')
})

test('should upsert an existing row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database.upsert('tableName', { ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should get a row in a table', async () => {
  const foundRow = await Database.get('tableName', row.id as number)
  expect(foundRow.id).toBe(row.id)
})

test('should get all rows in a table', async () => {
  const rows = await Database.getAll('tableName')
  expect(rows).toHaveLength(2)
})

test('should delete a row in a table', async () => {
  const deletedRow = await Database.remove('tableName', row.id as number)
  expect(deletedRow).toHaveProperty('id')
})
