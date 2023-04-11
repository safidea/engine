import debug from 'debug'
import { SchemaService, ConfigService } from 'foundation-common/server'
import ActionService from '../services/action.service'

import type { Actions } from '../../types'

const log: debug.IDebugger = debug('action:init')

export default function ActionInitializer() {
  const actions = ConfigService.get('actions') as Actions
  const path = join(__dirname, '../..', 'types/config.type.ts')
  SchemaService.validate(actions, { path, type: 'Actions' })
  log('Actions schema validated')

  for (const name of ActionService.getNames()) {
    const action = ActionService.get(name)
    const isUpdated = SchemaService.cache(action, 'actions/' + name)
    if (!isUpdated) {
      log(`${name} action is up to date`)
    } else {
      ActionService.writeModule(name)
      log(`${name} action has been updated`)
    }
  }
}
