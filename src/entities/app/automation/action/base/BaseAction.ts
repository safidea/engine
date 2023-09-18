import { AppServices } from '@entities/app/App'
import { BaseActionParams } from './BaseActionParams'
import { AutomationConfig, AutomationContext } from '../../Automation'
import { ActionError } from '../ActionError'
import { Table } from '@entities/app/table/Table'
import { newFilter } from '@entities/services/database/filter/Filter'
import { MultipleLinkedRecordsField } from '@entities/app/table/field/multipleLinkedRecords/MultipleLinkedRecordsField'
import { Bucket } from '@entities/app/bucket/Bucket'

export class BaseAction {
  readonly name: string
  readonly type: string

  constructor(
    params: BaseActionParams,
    protected readonly services: AppServices,
    protected readonly config: AutomationConfig
  ) {
    const { name, type } = params
    this.name = name
    this.type = type
  }

  throwError(message: string): never {
    throw new ActionError(this.name, this.type, message, this.config.automationName)
  }

  getTableByName(tableName: string): Table {
    const table = this.config.tables.getByName(tableName)
    if (!table) this.throwError(`table ${tableName} not found`)
    return table
  }

  getBucketByName(bucketName: string): Bucket {
    const bucket = this.config.buckets.getByName(bucketName)
    if (!bucket) this.throwError(`bucket ${bucketName} not found`)
    return bucket
  }

  tableFieldShouldExist(table: Table, fieldName: string): void {
    if (!table.fields.some((f) => f.name === fieldName))
      this.throwError(`field ${fieldName} not found in table ${table.name}`)
  }

  getValueFromPath(obj: unknown, path: string): unknown {
    const parts = path.split('.')
    for (const part of parts) {
      if (obj && typeof obj === 'object' && part in obj) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj = obj[part]
      } else {
        return undefined
      }
    }
    return obj
  }

  async createContextFromRecord(table: Table, id: string): Promise<AutomationContext> {
    const context: AutomationContext = { table: table.name }
    const record = await this.services.database.read(table, id)
    if (!record) {
      this.throwError(`record ${id} not found in table ${table.name}`)
    }
    context.data = record.data()
    for (const field of table.fields) {
      if (field instanceof MultipleLinkedRecordsField) {
        const ids = record.getMultipleLinkedRecordsValue(field.name)
        const linkedTable = this.getTableByName(field.table)
        const linkedRecords = await this.services.database.list(linkedTable, [
          newFilter({ field: 'id', operator: 'is_any_of', value: ids }),
        ])
        context.data[field.name] = linkedRecords.map((record) => record.data())
      }
    }
    return context
  }
}
