import { config } from './setup'
import checkSchema from '../src/check-schema'

test('should validate the schema', async () => {
  await checkSchema(config)
})

test('should invalidate the schema and throw an error', async () => {
  config.name = 1 as unknown as string
  await expect(checkSchema(config)).rejects.toThrow("Config file doesn't match expected schema")
})
