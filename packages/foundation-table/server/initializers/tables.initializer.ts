import debug from 'debug'
import { SchemaService } from 'foundation-common/server'
import TableService from '../services/table.service'
import { TYPES_PATH } from '../constants/table.constants'

const log: debug.IDebugger = debug('table:init')

export default function TableInitializer() {
  for (const name of TableService.getNames()) {
    const table = TableService.get(name)
    const isUpdated = SchemaService.cache(table, 'tables/' + name)
    if (!isUpdated) {
      log(`${name} table is up to date`)
    } else {
      SchemaService.validate(table, { path: TYPES_PATH, type: 'Table' })
      log(`${name} table schema has been validated`)

      TableService.updateSchema(name)
      log(`${name} table schema has been updated`)
    }
  }
}
