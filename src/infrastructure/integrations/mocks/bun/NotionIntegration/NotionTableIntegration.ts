import type { FilterDto } from '@domain/entities/Filter'
import type { NotionTablePageDto } from '@adapter/spi/dtos/NotionTablePageDto'
import type { INotionTableIntegration } from '@adapter/spi/integrations/NotionTableSpi'
import { type NotionTablePageProperties } from '@domain/integrations/Notion/NotionTablePage'
import type { TableObject } from '.'
import type { SQLiteDatabaseTableDriver } from '@infrastructure/drivers/bun/DatabaseDriver/SQLiteTableDriver'
import type { PersistedRecordFieldsDto } from '@adapter/spi/dtos/RecordDto'
import { nanoid } from 'nanoid'
import type { RecordFields } from '@domain/entities/Record'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

export class NotionTableBunIntegration implements INotionTableIntegration {
  readonly id: string
  readonly name: string
  private _properties: FieldDto[]

  constructor(
    private _db: SQLiteDatabaseTableDriver,
    _table: PersistedRecordFieldsDto<TableObject>
  ) {
    this.id = _table.id
    this.name = _table.fields.title
    this._properties = JSON.parse(_table.fields.properties)
  }

  exists = async () => {
    return this._db.exists()
  }

  create = async () => {
    await this._db.create()
  }

  createView = async () => {
    await this._db.createView()
  }

  migrate = async (properties: FieldDto[]) => {
    await this.migrate(properties)
  }

  insert = async <T extends NotionTablePageProperties>(page: T) => {
    const id = nanoid()
    await this._db.insert({
      id,
      fields: this._preprocess(page),
      created_at: new Date(),
    })
    return this.retrieve<T>(id)
  }

  insertMany = async <T extends NotionTablePageProperties>(pages: T[]) => {
    const pagesInserted: NotionTablePageDto<T>[] = []
    for (const page of pages) pagesInserted.push(await this.insert(page))
    return pagesInserted
  }

  update = async <T extends NotionTablePageProperties>(id: string, page: Partial<T>) => {
    const fields = this._preprocess(page)
    await this._db.update({
      id,
      fields,
      updated_at: new Date(),
    })
    return this.retrieve<T>(id)
  }

  updateMany = async <T extends NotionTablePageProperties>(
    pages: { id: string; page: Partial<T> }[]
  ) => {
    const pagesUpdated: Promise<NotionTablePageDto<T>>[] = []
    for (const { id, page } of pages) pagesUpdated.push(this.update(id, page))
    return Promise.all(pagesUpdated)
  }

  retrieve = async <T extends NotionTablePageProperties>(id: string) => {
    const record = await this._db.readById(id)
    if (!record) throw new Error(`Record not found: ${id}`)
    return this._postprocess<T>(record)
  }

  archive = async (id: string) => {
    await this._db.update({
      id,
      fields: {
        archived: true,
      },
      updated_at: new Date(),
    })
  }

  archiveMany = async (ids: string[]) => {
    const pagesArchived: Promise<void>[] = []
    for (const id of ids) pagesArchived.push(this.archive(id))
    return Promise.all(pagesArchived)
  }

  list = async <T extends NotionTablePageProperties>(filter?: FilterDto) => {
    const records = await this._db.list(filter)
    return records.map((record) => this._postprocess<T>(record))
  }

  _preprocess = (page: NotionTablePageProperties): RecordFields => {
    const fields: RecordFields = {}
    for (const [key, value] of Object.entries(page)) {
      const property = this._properties.find((p) => p.name === key)
      if (!property) throw new Error(`Property "${key}" does not exist`)
      if (value === undefined || value === null) {
        fields[key] = null
        continue
      }
      switch (property.type) {
        case 'TEXT':
          fields[key] = value ? String(value) : null
          break
        case 'TIMESTAMP':
          if (typeof value === 'number') fields[key] = new Date(value)
          else fields[key] = value as Date
          break
        case 'NUMERIC':
          fields[key] = value ? Number(value) : null
          break
        case 'BOOLEAN':
          fields[key] = value === 'false' || value === '0' ? false : Boolean(value)
          break
        case 'TEXT[]':
          if (!Array.isArray(value)) throw new Error(`Invalid property value: ${value}`)
          if (property.table) {
            fields[key] = value ? (value as string[]) : []
          } else {
            fields[key] = JSON.stringify(value || []) as string
          }
          break
        default:
          throw new Error(`Invalid property type: ${property.type}`)
      }
    }
    return fields
  }

  _postprocess = <T extends NotionTablePageProperties>(
    record: PersistedRecordFieldsDto<RecordFields>
  ): NotionTablePageDto<T> => {
    const page: RecordFields = {}
    for (const [key, value] of Object.entries(record.fields)) {
      const property = this._properties.find((p) => p.name === key)
      if (!property) throw new Error(`Property "${key}" does not exist`)
      switch (property.type) {
        case 'TEXT':
          page[key] = value ?? null
          break
        case 'TIMESTAMP':
          page[key] = value ? new Date(value as number) : null
          break
        case 'NUMERIC':
          page[key] = value ?? null
          break
        case 'BOOLEAN':
          page[key] = value ?? false
          break
        case 'TEXT[]':
          if (property.table) {
            page[key] = value ? (value as string[]) : []
          } else {
            page[key] = value ? JSON.parse(String(value)) : []
          }
          break
        default:
          throw new Error(`Invalid property type: ${property.type}`)
      }
    }
    return {
      id: record.id,
      properties: page as T,
      created_time: record.created_at.toISOString(),
      last_edited_time: record.updated_at?.toISOString() ?? record.created_at.toISOString(),
      archived: record.fields.archived ? Boolean(record.fields.archived) : false,
    }
  }
}
