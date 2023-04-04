import { join } from 'path'

export function get(resources: string[]): string {
  return resources
    .map((resource) => {
      const path = join(__dirname, '../../generated/', resource + '.js')
      return `const ${resource} = require('${path}')`
    })
    .join('\n')
}
