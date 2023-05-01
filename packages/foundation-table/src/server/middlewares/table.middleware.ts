import { DatabaseService } from '@database/server'
import { TableUtils } from '@table/server'

import type { RouterMiddlewareType } from '@common'
import type { DatabaseDataType } from '@database'

class TableMiddleware {
  public validateBaseExist: RouterMiddlewareType = async (req, res, next) => {
    const { base } = req.query
    const exist = DatabaseService.baseExist(base)
    if (!exist) {
      return res.status(404).json({
        error: `Base ${base} does not exist`,
      })
    }
    if (next) return next()
  }

  public validateTableExist: RouterMiddlewareType = async (req, res, next) => {
    const { base, table } = req.query
    const exist = DatabaseService.tableExist(base, table)
    if (!exist) {
      return res.status(404).json({
        error: `Table ${table} does not exist`,
      })
    }
    if (next) return next()
  }

  public validateRowExist: RouterMiddlewareType = async (req, res, next) => {
    const { base, table, id } = req.query
    const row = await DatabaseService.readById(base, table, { id })
    if (!row) {
      return res.status(404).json({
        error: `Row ${id} does not exist in table ${table}`,
      })
    }
    if (next) return next()
  }

  public validateBody: RouterMiddlewareType = async (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        error: 'Body is required',
      })
    }
    if (next) return next()
  }

  public validateBodyFields: RouterMiddlewareType = async (req, res, next) => {
    const errors = TableUtils.validateDataFields(req.query.table, req.body as DatabaseDataType)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Invalid body',
        details: errors,
      })
    }
    if (next) return next()
  }

  public validateBodyAllFields: RouterMiddlewareType = async (req, res, next) => {
    const errors = TableUtils.validateDataFields(
      req.query.table,
      req.body as DatabaseDataType,
      true
    )
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Invalid body',
        details: errors,
      })
    }
    if (next) return next()
  }
}

export default new TableMiddleware()
