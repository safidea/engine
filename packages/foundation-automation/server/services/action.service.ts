import fs from 'fs-extra'
import { join } from 'path'
import { ConfigService } from 'foundation-common/server'

import ResourceService from '../services/resource.service'
import { GENERATED_FOLDER_PATH } from '../settings/constants.settings'
import { Actions, Action } from '../../types'

class ActionService {
  private actions: Actions = {}

  constructor() {
    this.actions = ConfigService.get('actions') as Actions
  }

  get(name: string): Action {
    return this.actions[name]
  }

  getNames(): string[] {
    return Object.keys(this.actions)
  }

  getModulePath(name: string): string {
    const actionImplementation = this.get(name).implementation
    return join(GENERATED_FOLDER_PATH, actionImplementation.environment, name + '.js')
  }

  writeModule(name: string): void {
    const actionImplementation = this.get(name).implementation
    if (actionImplementation.type === 'javascript') {
      const path = this.getModulePath(name)
      const requires = ResourceService.getRequirementsCode(actionImplementation.resources ?? [])
      fs.ensureFileSync(path)
      fs.writeFileSync(
        path,
        `${requires}\n\nmodule.exports = async function (input) {${actionImplementation.source}}`
      )
    }
  }
}

const service = new ActionService()

export default service
