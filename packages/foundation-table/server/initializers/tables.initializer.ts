import debug from 'debug'
import { InitializerService } from 'foundation-common/server'
import TableService from '../services/table.service'
import { TYPES_PATH } from '../constants/table.constants'

const log: debug.IDebugger = debug('table:init')

export default function TableInitializer() {
  for (const name of TableService.getNames()) {
    const table = TableService.get(name)
    const isUpdated = InitializerService.cache(table, 'tables.' + name)
    if (!isUpdated) {
      log(`${name} table is up to date`)
    } else {
      InitializerService.validateSchemaFromType(table, { path: TYPES_PATH, type: 'Table', name })
      log(`${name} table schema has been validated`)
    }
  }
}
