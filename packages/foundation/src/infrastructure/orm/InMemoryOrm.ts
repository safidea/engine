import fs from 'fs-extra'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getAppFolder } from '@infrastructure/utils/PathUtils'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { DataDto } from '@application/dtos/DataDto'
import { RecordDto } from '@application/dtos/RecordDto'

interface Filter {
  [key: string]: string | number | boolean
}

interface Database {
  [key: string]: RecordDto[]
}

export class InMemoryOrm implements IOrmRepository {
  private url: string

  constructor(appFolder?: string) {
    this.url = join(appFolder ?? getAppFolder(), 'db.json')
    fs.ensureFileSync(this.url)
  }

  private async getDB(): Promise<Database> {
    return (await fs.readJSON(this.url, { throws: false })) ?? {}
  }

  private async setDB(db: Database): Promise<void> {
    return fs.writeJSON(this.url, db)
  }

  private addRecordFields(data: DataDto): RecordDto {
    return {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...data,
    }
  }

  async create(table: string, data: DataDto): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const record = this.addRecordFields(data)
    db[table].push(record)
    await this.setDB(db)
    return record
  }

  async createMany(table: string, data: DataDto[]): Promise<RecordDto[]> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const records = data.map((record) => this.addRecordFields(record))
    db[table].push(...records)
    await this.setDB(db)
    return records
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
    if (!row) throw new Error('Row not found')
    Object.assign(row, data)
    await this.setDB(db)
    return row
  }

  async deleteById(table: string, id: string): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error('Row not found')
    db[table].splice(index, 1)
    await this.setDB(db)
    return db[table][index]
  }

  async readById(table: string, id: string): Promise<RecordDto> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error('Row not found')
    return row
  }
}
