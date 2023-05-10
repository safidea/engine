import debug from 'debug'
import { TableService } from '@table/server'

import type { RouteControllerType } from '@common/server'
import type { DatabaseDataType } from '@database'

const log: debug.IDebugger = debug('table:controller')

class TableController {
  public create: RouteControllerType = async (req) => {
    const { base, table } = req.query
    const row = await TableService.create(base, table, {
      data: req.body as DatabaseDataType,
    })
    log(`Created new row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public update: RouteControllerType = async (req) => {
    const { base, table, id } = req.query
    const row = await TableService.update(base, table, {
      id,
      data: req.body as DatabaseDataType,
    })
    log(`Updated row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public read: RouteControllerType = async (req) => {
    const { base, table, id } = req.query
    const row = await TableService.read(base, table, { id })
    if (row) log(`Got row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public list: RouteControllerType = async (req) => {
    const { base, table } = req.query
    const rows = await TableService.list(base, table)
    log(`Got all rows in ${table}`)
    return { json: rows }
  }

  public delete: RouteControllerType = async (req) => {
    const { base, table, id } = req.query
    const row = await TableService.delete(base, table, { id })
    log(`Deleted row in ${table} with ID ${row.id}`)
    return { json: row }
  }
}

export default new TableController()
