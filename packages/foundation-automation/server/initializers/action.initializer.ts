import debug from 'debug'
import { SchemaService } from 'foundation-common/server'
import ActionService from '../services/action.service'

const log: debug.IDebugger = debug('action:init')

export default function ActionInitializer() {
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
