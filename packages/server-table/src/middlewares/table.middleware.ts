import { DatabaseService } from 'server-database'
import { ConfigUtils, ApiError } from 'server-common'

import type { TablesInterface } from 'shared-table'
import type { DatabaseDataType, DatabaseListParamsFiltersInterface } from 'shared-database'
import type { RequestInterface, RequestBodyInterface, RequestArrayBodyInterface } from 'shared-app'

class TableMiddleware {
  private databaseService: DatabaseService
  private configUtils: ConfigUtils

  constructor({
    databaseService,
    configUtils,
  }: {
    databaseService: DatabaseService
    configUtils: ConfigUtils
  }) {
    this.databaseService = databaseService
    this.configUtils = configUtils
  }

  public async validateAndExtractQuery(req: RequestInterface) {
    const { query } = req
    const filters: DatabaseListParamsFiltersInterface[] = []
    for (const key in query) {
      const matchFilter = key.match(/filter_(key|operator|value)_(\d+)$/)
      if (matchFilter) {
        const index = Number(matchFilter[2])
        filters[index] = filters[index] || {}
        if (key.startsWith('filter_key_')) {
          filters[index].key = query[key]
        } else if (key.startsWith('filter_operator_')) {
          filters[index].operator = query[key]
        } else if (key.startsWith('filter_value_')) {
          filters[index].value = query[key]
        }
      }
    }
    if (filters.length > 0) req.local.filters = filters
  }

  public async validateTableExist(req: RequestInterface) {
    const { table } = req.params
    const exist = this.databaseService.tableExist(table)
    if (!exist) throw new ApiError(`Table ${table} does not exist`, { status: 404 })
  }

  public async validateRowExist(req: RequestInterface) {
    const { table, id } = req.params
    const row = await this.databaseService.readById(table, id)
    if (!row) throw new ApiError(`Row ${id} does not exist in table ${table}`, { status: 404 })
  }

  public async validatePostBody(req: RequestBodyInterface) {
    const errors = this.validateDataFields(req.params.table, req.body)
    if (errors.length > 0) throw new ApiError('Invalid row', { errors, status: 400 })
  }

  public async validatePostArrayBody(req: RequestArrayBodyInterface) {
    const errors = this.validateArrayDataFields(req.params.table, req.body)
    if (errors.length > 0) throw new ApiError('Invalid row', { errors, status: 400 })
  }

  public async validatePatchBody(req: RequestBodyInterface) {
    const errors = this.validateDataFields(req.params.table, req.body, 'UPDATE')
    if (errors.length > 0) throw new ApiError('Invalid row', { errors, status: 400 })
  }

  public validatePutBody = this.validatePostBody

  private validateDataFields(
    table: string,
    data: DatabaseDataType = {},
    action = 'CREATE'
  ): string[] {
    const tables = this.configUtils.get('tables') as TablesInterface
    const { fields = {} } = tables[table] ?? {}
    const errors = []
    const values = { ...data }

    for (const field of Object.keys(fields)) {
      const fieldData = fields[field]
      const value = values[field]
      delete values[field]

      if (!value && (action === 'UPDATE' || fieldData.optional || fieldData.default)) {
        continue
      }

      if (!fieldData.optional && !fieldData.default && !value && fieldData.type !== 'Boolean') {
        errors.push(`Field ${field} is required`)
      }

      if (fieldData.type === 'Int' && value && !Number.isInteger(value)) {
        errors.push(`Field ${field} must be an integer`)
      }

      if (fieldData.type === 'String' && value && typeof value !== 'string') {
        errors.push(`Field ${field} must be a string`)
      }

      if (fieldData.type === 'DateTime' && value) {
        const date = new Date(String(value))
        data[field] = date.toISOString()
        if (isNaN(date.getTime())) {
          errors.push(`Field ${field} must be a valid date`)
        }
      }

      if (fieldData.type === 'Boolean' && value && typeof value !== 'boolean') {
        errors.push(`Field ${field} must be a boolean`)
      }

      if (
        fieldData.type === this.databaseService.getTableEnumName(table, field) &&
        value &&
        !fieldData.options?.includes(String(value))
      ) {
        errors.push(`Field ${field} must be one of ${fieldData.options?.join(', ')}`)
      }
    }

    if (Object.keys(values).length > 0) {
      errors.push(`Invalid fields: ${Object.keys(values).join(', ')}`)
    }

    return errors
  }

  private validateArrayDataFields(
    table: string,
    data: DatabaseDataType[] = [],
    action = 'CREATE'
  ): string[] {
    const errors = []
    for (const row of data) {
      errors.push(...this.validateDataFields(table, row, action))
    }
    return errors
  }
}

export default TableMiddleware
