import checkSchema from '../src/check-schema'
import { getDataset } from './.setup'

const config = getDataset()

test('should validate the schema', () => {
  expect(checkSchema(config)).toBe(config)
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
