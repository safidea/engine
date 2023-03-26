import * as Database from '../src'

test('should create a row in a table', async () => {
  const row = await Database.create('users', {
    email: 'test@test.com',
    password: 'password',
    name: 'Test'
  })

  expect(row).toHaveProperty('id')
  expect(row).toHaveProperty('email')
  expect(row).toHaveProperty('password')
})