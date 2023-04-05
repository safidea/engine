import fs from 'fs-extra'
import debug from 'debug'
import { join } from 'path'
import { ConfigService, SchemaService } from 'foundation-common/server'
import { ResourceService } from 'foundation-resource/server'

import type { Actions } from '../../types'

const log: debug.IDebugger = debug('action:init')

export default function ActionInitializer() {
  const actions = ConfigService.get('actions') as Actions
  const actionsName = Object.keys(actions)

  for (const actionName of actionsName) {
    const action = actions[actionName].implementation
    const isUpdated = SchemaService.cache(action, 'actions/' + actionName)
    if (!isUpdated) {
      log(`${actionName} action is up to date`)
    } else {
      if (action.type === 'javascript') {
        const path = join(__dirname, '../../generated/server', actionName + '.js')
        const requires = ResourceService.getRequirementsCode(action.resources ?? [])
        fs.ensureFileSync(path)
        fs.writeFileSync(
          path,
          `${requires}\n\nmodule.exports = async function (input) {${action.source}}`
        )
      }
      log(`${actionName} action has been updated`)
    }
  }
}
