import debug from 'debug'

import * as tableService from '../services/table.service'
import { Data, Row } from '../../types'

const log: debug.IDebugger = debug('table:controller')

export async function create(tableName: string, data: Data): Promise<Row> {
  const row = await tableService.create(tableName, data)
  log(`Created new row in ${tableName} with ID ${row.id}`)
  return row
}

export async function update(tableName: string, data: Row): Promise<Row> {
  const row = await tableService.update(tableName, data)
  log(`Updated row in ${tableName} with ID ${row.id}`)
  return row
}

export async function upsert(tableName: string, data: Data | Row): Promise<Row> {
  let row 
  if (data.id) {
    row = await tableService.update(tableName, data as Row)
  } else {
    row = await tableService.create(tableName, data as Data)
  }
  log(`Upsert row in ${tableName} with ID ${row.id}`)
  return row
}

export async function get(tableName: string, id: number): Promise<Row> {
  const row = await tableService.getById(tableName, id)
  log(`Got row in ${tableName} with ID ${row.id}`)
  return row
}

export async function getAll(tableName: string): Promise<Row[]> {
  const rows = await tableService.getAll(tableName)
  log(`Got all rows in ${tableName}`)
  return rows
}

export async function remove(tableName: string, id: number): Promise<Row> {
  const row = await tableService.removeById(tableName, id)
  log(`Deleted row in ${tableName} with ID ${row.id}`)
  return row
}
