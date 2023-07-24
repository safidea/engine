import fs from 'fs-extra'
import { join } from 'path'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { Record } from '@domain/entities/Record'
import { Table } from '@domain/entities/Table'
import { Filter } from '@domain/entities/Filter'
import { IsAnyOf } from '@domain/entities/filters/IsAnyOf'

interface Row {
  id: string
  created_time?: string
  last_modified_time?: string
  [key: string]: string | number | boolean | undefined
}
interface Database {
  [key: string]: Row[]
}

export class InMemoryOrm implements IOrmRepository {
  private url: string
  private tables: Table[] = []

  constructor(folder: string) {
    this.url = join(folder, 'db.json')
    fs.ensureFileSync(this.url)
  }

  public configure(tables: Table[]): void {
    this.tables = tables
  }

  private getTable(tableName: string): Table {
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

  mapRecordToRow(record: Record): Row {
    const row: Row = {
      ...record.fields,
      id: record.id,
    }
    if (record.created_time) row.created_time = record.created_time
    if (record.last_modified_time) row.last_modified_time = record.last_modified_time
    return row
  }

  mapRowToRecord(table: string, row: Row): Record {
    const { id, created_time, last_modified_time, ...fields } = row
    return new Record(
      table,
      fields,
      id,
      created_time ? String(created_time) : undefined,
      last_modified_time ? String(last_modified_time) : undefined
    )
  }

  async create(tableName: string, record: Record): Promise<string> {
    const db = await this.getDB()
    if (!db[tableName]) db[tableName] = []
    db[tableName].push(this.mapRecordToRow(record))
    await this.setDB(db)
    return record.id
  }

  async createMany(table: string, records: Record[]): Promise<string[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    db[table].push(...records.map((record) => this.mapRecordToRow(record)))
    await this.setDB(db)
    return records.map((record) => record.id)
  }

  async softUpdateById(table: string, record: Record, id: string): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error(`Record ${id} not found`)
    db[table][index] = { ...db[table][index], ...this.mapRecordToRow(record) }
    await this.setDB(db)
  }

  async list(table: string, filters?: Filter[]): Promise<Record[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const records = db[table]
    if (!filters) return records.map((row) => this.mapRowToRecord(table, row))
    return records
      .filter((record) => {
        for (const filter of filters) {
          const value = record[filter.field]
          const field = this.getTable(table).fields.find((field) => field.name === filter.field)
          if (filter instanceof IsAnyOf) {
            if (filter.field === 'id' || field?.format === 'text')
              return (
                filter.values.map((v) => String(v)).filter((v: string) => v === value).length > 0
              )
            if (field?.format === 'number')
              return (
                filter.values.map((v) => Number(v)).filter((v: number) => v === value).length > 0
              )
          }
          throw new Error(`Operator ${filter.operator} not supported`)
        }
      })
      .map((row) => this.mapRowToRecord(table, row))
  }

  async updateById(table: string, id: string, record: Record): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    Object.assign(row, this.mapRecordToRow(record))
    await this.setDB(db)
  }

  async deleteById(table: string, id: string): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error(`Row not found for id ${id} in table ${table}`)
    db[table].splice(index, 1)
    await this.setDB(db)
  }

  async readById(table: string, id: string): Promise<Record> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    return this.mapRowToRecord(table, row)
  }
}
