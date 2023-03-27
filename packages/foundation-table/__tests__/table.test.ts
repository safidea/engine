import { faker } from '@faker-js/faker'

import * as Database from '../src'
import { Data } from '../types'

const newRow = (): Data => ({
  string: faker.helpers.unique(faker.name.firstName),
  integer: faker.datatype.number(),
})

let row = newRow()

test('should return null if the table does not exist', async () => {
  try {
    await Database.create('non-existent-table', row)
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Table non-existent-table does not exist')
  }
})

test('should create a row in a table', async () => {
  row = await Database.create('table', row)
  expect(row).toHaveProperty('id')
})

test('should update a row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database.update('table', { ...row, string: newString })
  expect(row.string).toBe(newString)
})

test('should upsert a new row in a table', async () => {
  row = await Database.upsert('table', newRow())
  expect(row).toHaveProperty('id')
})

test('should upsert an existing row in a table', async () => {
  const newString = faker.helpers.unique(faker.name.firstName)
  row = await Database.upsert('table', { ...row, string: newString })
  expect(row.string).toBe(newString)
})
