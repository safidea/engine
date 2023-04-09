import fs from 'fs-extra'
import { PathUtils, ConfigService } from 'foundation-common/server'

import ResourceInitializer from '../initializers/resource.initializer'
import type { Resources } from '../../types'

const resources = ConfigService.get('resources') as Resources

test('should setup resources from config', async () => {
  await fs.remove(PathUtils.cache('resources', { dir: true }))
  try {
    ResourceInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should setup resources from cache', async () => {
  try {
    ResourceInitializer()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})

test('should able to import resources', async () => {
  for (const resourceName of Object.keys(resources)) {
    const env = resources[resourceName].environment
    const resource = await import(`../../generated/${env}/${resourceName}.js`)
    expect(resource).toBeDefined()
  }
})
