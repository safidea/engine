import debug from 'debug'

import * as tableService from '../services/table.service'
import { Data } from '../../types'

const log: debug.IDebugger = debug('table:controller')

export async function create(tableName: string, data: Data): Promise<Data> {
  const row = await tableService.create(tableName, data)
  log(`Created new row in ${tableName} with ID ${row.id}`)
  return row
}

export async function update(tableName: string, data: Data): Promise<Data> {
  const row = await tableService.update(tableName, data)
  log(`Updated row in ${tableName} with ID ${row.id}`)
  return row
}

export async function upsert(tableName: string, data: Data): Promise<Data> {
  const service = data.id ? 'update' : 'create'
  const row = await tableService[service](tableName, data)
  log(`Upsert row in ${tableName} with ID ${row.id}`)
  return row
}
