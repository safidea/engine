import fs from 'fs-extra'
import { join } from 'path'

import { ConfigService } from '../src'

test('should be able to get schema', async () => {
  const config = await ConfigService.get()
  expect(config).toBeDefined()
})

test('should throw an error if file not set', async () => {
  process.env.FOUNDATION_CONFIG_FILE = ''
  try {
    await ConfigService.get()
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe('FOUNDATION_CONFIG_FILE not set')
  }
})

test('should throw an error if file not found', async () => {
  process.env.FOUNDATION_CONFIG_FILE = 'not-found.json'
  try {
    await ConfigService.get()
    expect(true).toBe(false)
  } catch (error: any) {
    const path = join(__dirname, '../../..', process.env.FOUNDATION_CONFIG_FILE as string)
    expect(error.message).toBe(`Config file not found: ${path}`)
  }
})

test('should throw an error if file is not valid json', async () => {
  const path = '__tests__/not-valid.json'
  process.env.FOUNDATION_CONFIG_FILE = join('packages/foundation-common', path)
  fs.writeFileSync(path, '}')
  try {
    await ConfigService.get()
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.message).toBe(
      'Error parsing config file: Unexpected token } in JSON at position 0'
    )
  } finally {
    fs.unlinkSync(path)
  }
})
