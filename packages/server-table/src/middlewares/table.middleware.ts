import { DatabaseService } from 'server-database'
import TableUtils from '../utils/table.utils'

import type { RouteMiddlewareType } from 'server-common'
import type { DatabaseDataType } from 'shared-database'

class TableMiddleware {
  public validateBaseExist: RouteMiddlewareType = async (req) => {
    const { base } = req.query
    const exist = DatabaseService.baseExist(base)
    if (!exist) return { json: { error: `Base ${base} does not exist` }, status: 404 }
  }

  public validateTableExist: RouteMiddlewareType = async (req) => {
    const { base, table } = req.query
    const exist = DatabaseService.tableExist(base, table)
    if (!exist) return { json: { error: `Table ${table} does not exist` }, status: 404 }
  }

  public validateRowExist: RouteMiddlewareType = async (req) => {
    const { base, table, id } = req.query
    const row = await DatabaseService.readById(base, table, { id })
    if (!row) return { json: { error: `Row ${id} does not exist in table ${table}` }, status: 404 }
  }

  public validatePostBody: RouteMiddlewareType = async (req) => {
    const errors = TableUtils.validateDataFields(req.query.table, req.body as DatabaseDataType)
    if (errors.length > 0) return { json: { error: 'Invalid body', details: errors }, status: 400 }
  }

  public validatePatchBody: RouteMiddlewareType = async (req) => {
    const errors = TableUtils.validateDataFields(
      req.query.table,
      req.body as DatabaseDataType,
      'UPDATE'
    )
    if (errors.length > 0) return { json: { error: 'Invalid body', details: errors }, status: 400 }
  }

  public validatePutBody: RouteMiddlewareType = this.validatePostBody
}

export default new TableMiddleware()
