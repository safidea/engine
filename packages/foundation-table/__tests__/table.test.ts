import { faker } from '@faker-js/faker'

import { table } from '../src'
import { Data, Row } from '../types'

let row: Row
const newData = (): Data => ({
  stringField: faker.helpers.unique(faker.name.firstName),
  integerField: faker.datatype.number(),
})

test('should return null if the table does not exist', async () => {
  try {
    await table('non-existent-table').create(newData())
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Table non-existent-table does not exist')
  }
})

test('should create a row in a table', async () => {
  row = await table('tableName').create(newData())
  expect(row).toHaveProperty('id')
})

test('should update a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await table('tableName').update({ ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should upsert a new row in a table', async () => {
  row = await table('tableName').upsert(newData())
  expect(row).toHaveProperty('id')
})

test('should upsert an existing row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await table('tableName').upsert({ ...row, stringField: newString })
  expect(row.stringField).toBe(newString)
})

test('should get a row in a table', async () => {
  const foundRow = await table('tableName').get(row.id as number)
  expect(foundRow.id).toBe(row.id)
})

test('should get all rows in a table', async () => {
  const rows = await table('tableName').getAll()
  expect(rows).toHaveLength(2)
})

test('should delete a row in a table', async () => {
  const deletedRow = await table('tableName').remove(row.id as number)
  expect(deletedRow).toHaveProperty('id')
})
