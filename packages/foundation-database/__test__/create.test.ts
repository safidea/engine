import { faker } from '@faker-js/faker'

import * as Database from '../src'

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.name.firstName(),
}

test('should return null if the table does not exist', async () => {
  try {
    await Database.create('non-existent-table', user)
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Table non-existent-table does not exist')
  }
})

test('should create a row in a table', async () => {
  const row = await Database.create('users', user)
  expect(row).toHaveProperty('id')
  expect(row).toHaveProperty('email')
  expect(row).toHaveProperty('password')
})
