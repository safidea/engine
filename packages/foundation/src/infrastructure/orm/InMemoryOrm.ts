import fs from 'fs-extra'
import { join } from 'path'
import { getAppFolder } from '@infrastructure/utils/PathUtils'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { Record } from '@domain/entities/Record'
import { Table } from '@domain/entities/Table'
import { Filter } from '@domain/entities/Filter'
import { IsAnyOf } from '@domain/entities/filters/IsAnyOf'

interface Database {
  [key: string]: Record[]
}

export class InMemoryOrm implements IOrmRepository {
  private url: string
  private tables: Table[] = []

  constructor(appFolder?: string) {
    this.url = join(appFolder ?? getAppFolder(), 'db.json')
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

  async create(tableName: string, record: Record): Promise<string> {
    const db = await this.getDB()
    if (!db[tableName]) db[tableName] = []
    db[tableName].push(record)
    await this.setDB(db)
    return record.id
  }

  async createMany(table: string, records: Record[]): Promise<string[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    db[table].push(...records)
    await this.setDB(db)
    return records.map((record) => record.id)
  }

  async list(table: string, filters?: Filter[]): Promise<Record[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const records = db[table]
    if (!filters) return records
    return records.filter((record) => {
      for (const filter of filters) {
        const value = record.fields[filter.field]
        const field = this.getTable(table).fields.find((field) => field.name === filter.field)
        if (!field) throw new Error(`Field ${filter.field} not found in table ${table}`)
        if (filter instanceof IsAnyOf) {
          if (field.format === 'text')
            return filter.values.map((v) => String(v)).filter((v: string) => v === value).length > 0
          if (field.format === 'number')
            return filter.values.map((v) => Number(v)).filter((v: number) => v === value).length > 0
        }
        throw new Error(`Operator ${filter.operator} not supported`)
      }
    })
  }

  async updateById(table: string, id: string, record: Record): Promise<Record> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    Object.assign(row, record)
    await this.setDB(db)
    return row
  }

  async deleteById(table: string, id: string): Promise<Record> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error(`Row not found for id ${id} in table ${table}`)
    db[table].splice(index, 1)
    await this.setDB(db)
    return db[table][index]
  }

  async readById(table: string, id: string): Promise<Record> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error(`Row not found for id ${id} in table ${table}`)
    return row
  }
}
