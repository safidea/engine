import fs from 'fs-extra'
import { PathUtils } from 'foundation-common/server'

import ActionInitializer from '../initializers/action.initializer'

test('should setup actions from config', () => {
  fs.removeSync(PathUtils.cache('actions', { dir: true }))
  try {
    ActionInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should setup actions from cache', () => {
  try {
    ActionInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})
