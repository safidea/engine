import fs from 'fs-extra'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getAppFolder } from '@infrastructure/utils/PathUtils'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { DataDto } from '@application/dtos/DataDto'
import { RecordDto } from '@application/dtos/RecordDto'
import { TableDto } from '@application/dtos/TableDto'

interface Filter {
  [key: string]: string | number | boolean
}

interface Database {
  [key: string]: RecordDto[]
}

export class InMemoryOrm implements IOrmRepository {
  private url: string
  private tables: TableDto[] = []

  constructor(appFolder?: string) {
    this.url = join(appFolder ?? getAppFolder(), 'db.json')
    fs.ensureFileSync(this.url)
  }

  public configure(tables: TableDto[]): void {
    this.tables = tables
  }

  private getTable(tableName: string): TableDto {
    const table = this.tables.find((table) => table.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table
  }

  private async getDB(): Promise<Database> {
    return (await fs.readJSON(this.url, { throws: false })) ?? {}
  }

  private async setDB(db: Database): Promise<void> {
    return fs.writeJSON(this.url, db)
  }

  private addDefaultRecordFields(data: DataDto, id?: string): RecordDto {
    return {
      id: id ?? uuidv4(),
      created_time: new Date().toISOString(),
      ...data,
    }
  }

  private getLinkedFields(fromTableName: string, toTableName: string) {
    const linkedTable = this.getTable(fromTableName)
    return linkedTable.fields.find(
      (field) =>
        ['single_linked_record', 'multiple_linked_records'].includes(field.type) &&
        'table' in field &&
        field.table === toTableName
    )
  }

  async create(tableName: string, data: DataDto): Promise<string> {
    const table = this.getTable(tableName)
    const recordId = uuidv4()
    for (const fieldName of Object.keys(data)) {
      const field = table.fields.find((field) => field.name === fieldName)
      if (!field) throw new Error(`Field ${fieldName} not found in table ${tableName}`)
      let value = data[fieldName]
      if (field.type === 'single_linked_record') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const linkedField = this.getLinkedFields(field.table, tableName)
          if (linkedField) value = { ...value, [linkedField.name]: recordId }
          data[fieldName] = await this.create(field.table, value)
        }
      } else if (field.type === 'multiple_linked_records') {
        if (Array.isArray(value)) {
          value = value
            .map((record) => (typeof record === 'object' ? record : {}))
            .filter((r) => Object.keys(r).length > 0)
          if (value.length > 0) {
            const linkedField = this.getLinkedFields(field.table, tableName)
            if (linkedField) value = value.map((r) => ({ ...r, [linkedField.name]: recordId }))
            data[fieldName] = await this.createMany(field.table, value)
          }
        }
      }
    }
    const record = this.addDefaultRecordFields(data, recordId)
    const db = await this.getDB()
    if (!db[tableName]) db[tableName] = []
    db[tableName].push(record)
    await this.setDB(db)
    return record.id
  }

  async createMany(table: string, data: DataDto[]): Promise<string[]> {
    const records = data.map((record) => this.addDefaultRecordFields(record))
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    db[table].push(...records)
    await this.setDB(db)
    return records.map((record) => record.id)
  }

  async list(table: string, filter?: Filter): Promise<RecordDto[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    if (!filter) return db[table]
    return db[table].filter((row) => {
      for (const key in filter) {
        if (filter[key] !== row[key]) return false
      }
      return true
    })
  }

  async updateById(table: string, id: string, data: DataDto): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    Object.assign(row, data)
    await this.setDB(db)
    return row
  }

  async deleteById(table: string, id: string): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error(`Row not found for id ${id} in table ${table}`)
    db[table].splice(index, 1)
    await this.setDB(db)
    return db[table][index]
  }

  async readById(table: string, id: string): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    return row
  }
}
