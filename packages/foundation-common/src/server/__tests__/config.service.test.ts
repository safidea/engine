import fs from 'fs-extra'
import { join } from 'path'

import { ConfigService } from '../'

describe('get config', () => {
  it('should be able to get config', () => {
    const config = ConfigService.get()
    expect(config).toBeDefined()
  })

  it('should be able to get config from object path', () => {
    const config = ConfigService.get('name')
    expect(config).toBe('test')
  })

  it('should throw an error if the config path is not set', () => {
    delete process.env.CONFIG_FILE
    expect(ConfigService.init).toThrowError('CONFIG_FILE not set')
  })

  it('should throw an error if file not set', () => {
    process.env.CONFIG_FILE = ''
    try {
      ConfigService.init()
      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.message).toBe('CONFIG_FILE not set')
    }
  })

  it('should throw an error if file not found', () => {
    process.env.CONFIG_FILE = 'not-found.json'
    try {
      ConfigService.init()
      expect(true).toBe(false)
    } catch (error: any) {
      const path = join(__dirname, '../../../..', process.env.CONFIG_FILE as string)
      expect(error.message).toBe(`Config file not found: ${path}`)
    }
  })

  it('should throw an error if file is not valid json', () => {
    const path = './server/__tests__/not-valid.json'
    process.env.CONFIG_FILE = join('packages/foundation-common', path)
    fs.writeFileSync(path, '}')
    try {
      ConfigService.init()
      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.message).toBe('Error parsing config file')
    } finally {
      fs.unlinkSync(path)
    }
  })
})
