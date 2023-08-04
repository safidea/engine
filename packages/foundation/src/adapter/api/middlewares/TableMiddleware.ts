import { FilterDto } from '@application/dtos/table/FilterDto'
import { App } from '@domain/entities/App'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { ApiError } from '@domain/entities/errors/ApiError'
import { RecordDto, RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { RequestDto } from '@application/dtos/table/RequestDto'
import { NumberField } from '@domain/entities/table/fields/NumberField'
import { Currency } from '@domain/entities/table/fields/Currency'
import { SingleLineText } from '@domain/entities/table/fields/SingleLineText'
import { LongText } from '@domain/entities/table/fields/LongText'
import { SingleSelect } from '@domain/entities/table/fields/SingleSelect'
import { Datetime } from '@domain/entities/table/fields/Datetime'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { Formula } from '@domain/entities/table/fields/Formula'
import { Rollup } from '@domain/entities/table/fields/Rollup'

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

  public async validatePostBody(table: string, record: RecordToCreateDto): Promise<void> {
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
    record: RecordToCreateDto = {},
    action = 'CREATE',
    sourceTable?: string
  ): string[] {
    const { tables } = this._app
    const { fields = [] } = tables.find((t) => t.name === table) ?? {}
    const errors = []
    const values = { ...record }

    for (const field of fields) {
      if (!field) {
        throw new Error(`field "${field}" does not exist in table ${table}`)
      }
      const value = values[field.name]
      delete values[field.name]

      if (field instanceof Formula || field instanceof Rollup) {
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

      if (!field.optional && !field.default && value == null && field.type !== 'Boolean') {
        errors.push(`field "${field.name}" is required`)
      }

      if ((field instanceof NumberField || field instanceof Currency) && value) {
        const number = Number(value)
        if (isNaN(number)) {
          errors.push(`field "${field.name}" must be a number`)
        } else {
          record[field.name] = number
        }
      }

      if (
        (field instanceof SingleLineText ||
          field instanceof LongText ||
          field instanceof SingleSelect) &&
        value &&
        typeof value !== 'string'
      ) {
        errors.push(`field "${field.name}" must be a string`)
      }

      if (field instanceof Datetime && value) {
        const date = new Date(String(value))
        if (isNaN(date.getTime())) {
          errors.push(`field "${field.name}" must be a valid date`)
        } else {
          record[field.name] = date.toISOString()
        }
      }

      if (field.type === 'checkbox' && value && typeof value !== 'boolean') {
        errors.push(`field "${field}" must be a boolean`)
      }

      if (field instanceof MultipleLinkedRecords && value) {
        if (typeof value === 'object' && 'create' in value) {
          if (Array.isArray(value.create) && value.create.length > 0) {
            for (const record of value.create) {
              if (typeof record === 'object' && 'table' in field) {
                errors.push(...this.validateRecordValues(field.table, record, action, table))
              }
            }
          } else {
            errors.push(`property "create" at field "${field.name}" should be an array of records`)
          }
        } else {
          errors.push(`field "${field.name}" must be an object with create property`)
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
