import fs from 'fs-extra'
import debug from 'debug'
import { join } from 'path'
import { ConfigService, SchemaService } from 'foundation-common/server'

import type { Resources } from '../../types'

const log: debug.IDebugger = debug('resource:init')

export default function ResourceInitializer() {
  const resources = ConfigService.get('resources') as Resources
  const resourcesNames = Object.keys(resources)

  for (const resourceName of resourcesNames) {
    const resource = resources[resourceName]
    const isUpdated = SchemaService.cache(resource, 'resources/' + resourceName)
    if (!isUpdated) {
      log(`${resourceName} resource is up to date`)
    } else {
      if (resource.type === 'javascript') {
        const path = join(__dirname, '../../generated', resource.environment, resourceName + '.js')
        fs.ensureFileSync(path)
        fs.writeFileSync(path, resource.source)
      }
      log(`${resourceName} resource has been updated`)
    }
  }
}
