import fs from 'fs-extra'
import { join } from 'path'
import { ConfigService } from 'foundation-common/server'

import { GENERATED_FOLDER_PATH } from '../settings/constants.settings'
import type { Resources, Resource } from '../../types'

class ResourceService {
  private resources: Resources

  constructor() {
    this.resources = ConfigService.get('resources') as Resources
  }

  get(name: string): Resource {
    return this.resources[name]
  }

  getNames(): string[] {
    return Object.keys(this.resources)
  }

  getModulePath(name: string): string {
    const resource = this.get(name)
    return join(GENERATED_FOLDER_PATH, resource.environment, name + '.js')
  }

  getRequirementsCode(names: string[]): string {
    return names.map((name) => `const ${name} = require('${this.getModulePath(name)}')`).join('\n')
  }

  writeModule(name: string): void {
    const resource = this.get(name)
    if (resource.type === 'javascript') {
      const path = this.getModulePath(name)
      fs.ensureFileSync(path)
      fs.writeFileSync(path, resource.source)
    }
  }
}

const service = new ResourceService()

export default service
