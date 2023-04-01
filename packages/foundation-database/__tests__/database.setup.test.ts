import fs from 'fs-extra'
import { PathUtils } from 'foundation-common'

import DatabaseSetup from '../scripts/database.setup'

test('should setup the database from config', async () => {
  fs.writeFileSync(PathUtils.cache('database'), '')
  try {
    await DatabaseSetup()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should setup the database from cache', async () => {
  try {
    await DatabaseSetup()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})
