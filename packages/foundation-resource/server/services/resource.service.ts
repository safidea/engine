import { join } from 'path'
import { ConfigService } from 'foundation-common/server'

import type { Resources } from '../../types'

export function getRequirementsCode(resourcesNames: string[]): string {
  const resources = ConfigService.get('resources') as Resources
  return resourcesNames
    .map((resourceName) => {
      const resource = resources[resourceName]
      const path = join(__dirname, '../../generated/', resource.environment, resourceName + '.js')
      return `const ${resource} = require('${path}')`
    })
    .join('\n')
}
