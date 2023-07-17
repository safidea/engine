import fs from 'fs-extra'
import { join } from 'path'
import { getAppFolder } from '@infrastructure/utils/PathUtils'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

interface Data {
  [key: string]: string | number | boolean
}

interface Database {
  [key: string]: Data[]
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

  async create(table: string, data: Data): Promise<Data> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    db[table].push(data)
    await this.setDB(db)
    return data
  }

  async list(table: string, filter?: Data): Promise<Data[]> {
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

  async updateById(table: string, id: string, data: Data): Promise<Data> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error('Row not found')
    Object.assign(row, data)
    await this.setDB(db)
    return row
  }

  async deleteById(table: string, id: string): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error('Row not found')
    db[table].splice(index, 1)
    await this.setDB(db)
  }

  async readById(table: string, id: string): Promise<Data> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const row = db[table].find((row) => row.id === id)
    if (!row) throw new Error('Row not found')
    return row
  }
}
