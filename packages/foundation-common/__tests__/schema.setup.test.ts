import fs from 'fs-extra'
import { join } from 'path'
import * as Schema from '../scripts/schema.setup'

const params = {
  path: './__tests__/test-json.type.ts',
  type: 'TestJson',
}

const json = {
  name: 'test',
  version: 1,
  description: {
    published: true,
  },
}

const cachePath = join(__dirname, './data/schema.cache.json')

test('should be able to validate schema', async () => {
  await Schema.validate(json, params)
  expect(true).toBe(true)
})

test('should throw an error if schema is not build', async () => {
  try {
    console.error = jest.fn()
    await Schema.validate(json, { ...params, path: 'not-found.ts' })
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe('Error generating schema')
  }
})

test('should throw an error if schema is not valid', async () => {
  try {
    await Schema.validate({ ...json, description: 'test' }, params)
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe(
      "Config file doesn't match expected schema:\n/description must be object"
    )
  }
})

test('should cache schema if updated', async () => {
  fs.writeFileSync(cachePath, '')
  const isUpdated = await Schema.cache(json, cachePath)
  expect(isUpdated).toBe(true)
})

test('should not cache schema if nothing change', async () => {
  const isUpdated = await Schema.cache(json, cachePath)
  expect(isUpdated).toBe(false)
})
