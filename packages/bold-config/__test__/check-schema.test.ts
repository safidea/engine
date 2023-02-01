import { config } from './setup'
import checkSchema from '../src/check-schema'

test('should validate the schema', () => {
  checkSchema(config)
  expect(true).toBe(true)
})

test('should invalidate the schema and throw an error', () => {
  try {
    config.name = 1 as unknown as string
    checkSchema(config)
    expect(false).toBe(true)
  } catch (e) {
    expect(e).toBeInstanceOf(Error)
  }
})
