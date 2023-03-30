import fs from 'fs-extra'
import { join } from 'path'

import * as ConfigService from '../src/services/config.service'

const params = {
  path: './__tests__/test-json.type.ts',
  tsconfig: './tsconfig.json',
  type: 'TestJson',
}

test('should be able to read file', async () => {
  const config = await ConfigService.readFile()
  expect(config).toBeDefined()
})

test('should throw an error if file not set', async () => {
  process.env.FOUNDATION_CONFIG_FILE = ''
  try {
    await ConfigService.readFile()
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe('FOUNDATION_CONFIG_FILE not set')
  }
})

test('should throw an error if file not found', async () => {
  process.env.FOUNDATION_CONFIG_FILE = 'not-found.json'
  try {
    await ConfigService.readFile()
    expect(true).toBe(false)
  } catch (error: any) {
    const path = join(__dirname, '..', process.env.FOUNDATION_CONFIG_FILE as string)
    expect(error.message).toBe(`Config file not found: ${path}`)
  }
})

test('should throw an error if file is not valid json', async () => {
  const path = '__tests__/not-valid.json'
  process.env.FOUNDATION_CONFIG_FILE = path
  fs.writeFileSync(path, '}')
  try {
    await ConfigService.readFile()
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe(
      'Error parsing config file: Unexpected token } in JSON at position 0'
    )
  } finally {
    fs.unlinkSync(path)
  }
})

test('should be able to validate schema', async () => {
  const json = {
    name: 'test',
    version: 1,
    description: {
      published: true,
    },
  }
  const valid = await ConfigService.validateSchema(json, params)
  expect(valid).toBe(true)
})

test('should throw an error if schema is not valid', async () => {
  const json = {
    name: 'test',
    version: 1,
    description: {
      published: true,
    },
    extra: 'extra',
  }
  try {
    await ConfigService.validateSchema(json, params)
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe(
      'Config file doesn\'t match expected schema\n[\n  "is not allowed to have the additional property \\"extra\\""\n]'
    )
  }
})
