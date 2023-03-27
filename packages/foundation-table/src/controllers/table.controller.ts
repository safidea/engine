import debug from 'debug'

import * as tableService from '../services/table.service'
import { Data, Row } from '../../types'

const log: debug.IDebugger = debug('table:controller')

export default function table(tableName: string) {
  async function create(data: Data): Promise<Row> {
    const row = await tableService.create(tableName, data)
    log(`Created new row in ${tableName} with ID ${row.id}`)
    return row
  }

  async function update(data: Row): Promise<Row> {
    const row = await tableService.update(tableName, data)
    log(`Updated row in ${tableName} with ID ${row.id}`)
    return row
  }

  async function upsert(data: Data | Row): Promise<Row> {
    let row
    if (data.id) {
      row = await tableService.update(tableName, data as Row)
    } else {
      row = await tableService.create(tableName, data as Data)
    }
    log(`Upsert row in ${tableName} with ID ${row.id}`)
    return row
  }

  async function get(id: number): Promise<Row> {
    const row = await tableService.getById(tableName, id)
    log(`Got row in ${tableName} with ID ${row.id}`)
    return row
  }

  async function getAll(): Promise<Row[]> {
    const rows = await tableService.getAll(tableName)
    log(`Got all rows in ${tableName}`)
    return rows
  }

  async function remove(id: number): Promise<Row> {
    const row = await tableService.removeById(tableName, id)
    log(`Deleted row in ${tableName} with ID ${row.id}`)
    return row
  }

  return {
    create,
    update,
    upsert,
    get,
    getAll,
    remove,
  }
}
