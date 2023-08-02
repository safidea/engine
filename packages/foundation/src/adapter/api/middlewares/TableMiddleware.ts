import { FilterDto } from '@application/dtos/table/FilterDto'
import { App } from '@domain/entities/App'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { ApiError } from '@domain/entities/errors/ApiError'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { RequestDto } from '@application/dtos/table/RequestDto'

export class TableMiddleware {
  constructor(
    private readonly _app: App,
    private readonly _orm: IOrmGateway
  ) {}

  public async validateTableExist(request: RequestDto): Promise<string> {
    const { table } = request.params ?? {}
    const exist = this._orm.tableExists(table)
    if (!exist) throw new ApiError(`Table ${table} does not exist`, 404)
    return table
  }

  public async validateAndExtractQuery(request: RequestDto): Promise<FilterDto[]> {
    const { query } = request
    const filters: FilterDto[] = []
    if (query) {
      for (const key in query) {
        const matchFilter = key.match(/filter_(field|operator|value)_(\d+)$/)
        if (matchFilter) {
          const index = Number(matchFilter[2])
          const value = query[key]
          filters[index] = filters[index] || {}
          if (key.startsWith('filter_field_')) {
            filters[index].field = value
          } else if (key.startsWith('filter_operator_')) {
            if (value === 'is_any_of') {
              filters[index].operator = value
            } else {
              throw new Error(`Operator ${value} is not supported`)
            }
          } else if (key.startsWith('filter_value_')) {
            if (filters[index].operator === 'is_any_of') {
              filters[index].value = value.split(',')
            }
          }
        }
      }
    }
    return filters
  }

  public async validateRowExist(request: RequestDto): Promise<string> {
    const { table, id } = request.params ?? {}
    const row = await this._orm.readById(table, id)
    if (!row) throw new ApiError(`Row ${id} does not exist in table ${table}`, 404)
    return id
  }

  public async validateBodyExist(request: RequestDto): Promise<RecordDto | RecordDto[]> {
    const { body } = request
    if (!body) throw new ApiError(`Body is empty`, 400)
    return body
  }

  public async validatePostBody(table: string, record: RecordDto): Promise<void> {
    const errors = this.validateRecordValues(table, record)
    if (errors.length > 0) throw new ApiError(`Invalid record values :\n${errors.join('\n')}`, 400)
  }

  public async validatePostArrayBody(table: string, records: RecordDto[]): Promise<void> {
    if (!records) throw new ApiError(`Body is empty`, 400)
    const errors = this.validateArrayRecordValues(table, records)
    if (errors.length > 0) throw new ApiError(`Invalid record values :\n${errors.join('\n')}`, 400)
  }

  public async validatePatchBody(table: string, record: RecordDto): Promise<void> {
    const errors = this.validateRecordValues(table, record, 'UPDATE')
    if (errors.length > 0) throw new ApiError(`Invalid record values :\n${errors.join('\n')}`, 400)
  }

  private validateRecordValues(
    table: string,
    record: RecordDto = {},
    action = 'CREATE',
    sourceTable?: string
  ): string[] {
    const { tables } = this._app
    const { fields = [] } = tables.find((t) => t.name === table) ?? {}
    const errors = []
    const values = { ...record }

    for (const field of fields) {
      if (!field) {
        throw new Error(`Field ${field} does not exist in table ${table}`)
      }
      const value = values[field.name]
      delete values[field.name]

      if (['formula', 'rollup'].includes(field.type)) {
        if (value) delete record[field.name]
        continue
      }

      if (
        !value &&
        (action === 'UPDATE' ||
          field.optional ||
          field.default ||
          (!!sourceTable && 'table' in field && sourceTable === field.table))
      ) {
        continue
      }

      if (!field.optional && !field.default && !value && field.type !== 'Boolean') {
        errors.push(`Field ${field.name} is required`)
      }

      if (field.type === 'Int' && value) {
        const number = Number(value)
        if (isNaN(number) || !Number.isInteger(number)) {
          errors.push(`Field ${field.name} must be an integer`)
        } else {
          record[field.name] = number
        }
      }

      if (field.type === 'Decimal' && value) {
        const decimal = Number(value)
        if (isNaN(decimal)) {
          errors.push(`Field ${field.name} must be a decimal`)
        } else {
          record[field.name] = decimal
        }
      }

      if (field.type === 'String' && value && typeof value !== 'string') {
        errors.push(`Field ${field.name} must be a string`)
      }

      if (field.type === 'DateTime' && value) {
        const date = new Date(String(value))
        if (isNaN(date.getTime())) {
          errors.push(`Field ${field.name} must be a valid date`)
        } else {
          record[field.name] = date.toISOString()
        }
      }

      if (field.type === 'Boolean' && value && typeof value !== 'boolean') {
        errors.push(`Field ${field} must be a boolean`)
      }

      if (field.type === 'Link' && value) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            if (action === 'CREATE') {
              for (const row of value) {
                if (typeof row === 'object' && 'table' in field) {
                  errors.push(...this.validateRecordValues(field.table, row, action, table))
                }
              }
            }
          } else {
            errors.push(`Array of field ${field.name} should not be empty`)
          }
        } else {
          errors.push(`Field ${field.name} must be an array of rows`)
        }
      }
    }

    if (Object.keys(values).length > 0) {
      errors.push(`Invalid fields: ${Object.keys(values).join(', ')}`)
    }

    return errors
  }

  private validateArrayRecordValues(
    table: string,
    records: RecordDto[] = [],
    action = 'CREATE'
  ): string[] {
    const errors = []
    for (const record of records) {
      errors.push(...this.validateRecordValues(table, record, action))
    }
    return errors
  }
}
