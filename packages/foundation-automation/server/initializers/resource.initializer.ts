import debug from 'debug'
import { SchemaService } from 'foundation-common/server'
import ResourceService from '../services/resource.service'

const log: debug.IDebugger = debug('resource:init')

export default function ResourceInitializer() {
  const actions = ConfigService.get('actions') as Actions
  const path = join(__dirname, '../..', 'types/config.type.ts')
  SchemaService.validate(actions, { path, type: 'Actions' })
  log('Actions schema validated')
  
  for (const name of ResourceService.getNames()) {
    const resource = ResourceService.get(name)
    const isUpdated = SchemaService.cache(resource, 'resources/' + name)
    if (!isUpdated) {
      log(`${name} resource is up to date`)
    } else {
      ResourceService.writeModule(name)
      log(`${name} resource has been updated`)
    }
  }
}
