import fs from 'fs-extra'

import { SchemaService, PathUtils } from '../'

const partialConfig = {
  name: 'test',
  version: 1,
  description: {
    published: true,
  },
}

describe('validate partial config', () => {
  const params = {
    path: './server/__tests__/test-json.type.ts',
    type: 'TestJson',
  }

  it('should be able to validate partial config', () => {
    SchemaService.validate(partialConfig, params)
    expect(true).toBe(true)
  })

  it('should throw an error if config is not build', () => {
    try {
      console.error = jest.fn()
      SchemaService.validate(partialConfig, { ...params, path: 'not-found.ts' })
      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.message).toBe('Error generating schema')
    }
  })

  it('should throw an error if config is not valid', () => {
    try {
      SchemaService.validate({ ...partialConfig, description: 'test' }, params)
      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.message).toBe(
        "Config file doesn't match expected schema:\n/description must be object"
      )
    }
  })
})

describe('cache config', () => {
  const cachePath = PathUtils.cache('test')

  it('should cache config if updated', () => {
    fs.writeFileSync(cachePath, '')
    const isUpdated = SchemaService.cache(partialConfig, 'test')
    expect(isUpdated).toBe(true)
  })

  it('should not cache config if nothing change', () => {
    const isUpdated = SchemaService.cache(partialConfig, 'test')
    expect(isUpdated).toBe(false)
  })
})
