import debug from 'debug'
import { TableService } from '@table/server'

import type { RouterControllerType } from '@common'
import type { DatabaseDataType } from '@database'

const log: debug.IDebugger = debug('table:controller')

class TableController {
  public create: RouterControllerType = async (req, res) => {
    const { base, table } = req.query
    const row = await TableService.create(base, table, {
      data: req.body as DatabaseDataType,
    })
    log(`Created new row in ${table} with ID ${row.id}`)
    res.status(200).json(row)
  }

  public update: RouterControllerType = async (req, res) => {
    const { base, table, id } = req.query
    const row = await TableService.update(base, table, {
      id,
      data: req.body as DatabaseDataType,
    })
    log(`Updated row in ${table} with ID ${row.id}`)
    res.status(200).json(row)
  }

  public read: RouterControllerType = async (req, res) => {
    const { base, table, id } = req.query
    const row = await TableService.read(base, table, { id })
    log(`Got row in ${table} with ID ${row.id}`)
    res.status(200).json(row)
  }

  public list: RouterControllerType = async (req, res) => {
    const { base, table } = req.query
    const rows = await TableService.list(base, table)
    log(`Got all rows in ${table}`)
    res.status(200).json(rows)
  }

  public delete: RouterControllerType = async (req, res) => {
    const { base, table, id } = req.query
    const row = await TableService.delete(base, table, { id })
    log(`Deleted row in ${table} with ID ${row.id}`)
    res.status(200).json(row)
  }
}

export default new TableController()
