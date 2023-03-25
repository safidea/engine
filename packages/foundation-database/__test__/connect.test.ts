import * as Database from '../src'

test('should connect to the database', async () => {
  expect(await Database.connect()).toBe(true)
})
