import fs from 'fs-extra'
import { PathUtils, ConfigService } from 'foundation-common/server'

import DatabaseInitializer from '../initializers/database.initializer'
import type { Config } from '../../types'

test('should setup the database from config', () => {
  fs.writeFileSync(PathUtils.cache('database'), '')
  try {
    DatabaseInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should setup the database from cache', () => {
  try {
    DatabaseInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should setup the database with accounts tables', () => {
  const config = ConfigService.get() as Config
  config.database.accounts = true
  try {
    DatabaseInitializer(config)
  } catch (error) {
    expect(error).toBeUndefined()
  }
})
