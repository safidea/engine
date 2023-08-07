import fs from 'fs-extra'
import { join } from 'path'
import lockfile from 'proper-lockfile'
import { Orm } from '@adapter/spi/orm/Orm'
import { TableDto } from '@adapter/api/table/dtos/TableDto'
import { RecordDto, RecordFieldValue } from '@adapter/api/app/dtos/RecordDto'
import { FilterDto } from '@adapter/api/app/dtos/FilterDto'

interface TableRecord {
  [key: string]: RecordFieldValue
}
interface Database {
  [key: string]: TableRecord[]
}

export class InMemoryOrm implements Orm {
  private url: string
  private tables: TableDto[] = []

  constructor(folder: string) {
    this.url = join(folder, 'db.json')
    if (fs.existsSync(this.url)) return
    fs.ensureFileSync(this.url)
    fs.writeJSONSync(this.url, {})
  }

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await lockfile.lock(this.url, {
      retries: {
        retries: 10, // Retry 10 times
        factor: 1.5, // Exponential factor of 1.5
        minTimeout: 100, // Start at 100ms
        maxTimeout: 10 * 1000, // Don't wait more than 10s between retries
      },
    })
    try {
      return await fn()
    } finally {
      await lockfile.unlock(this.url)
    }
  }

  public configure(tables: TableDto[]): void {
    this.tables = tables
  }

  public tableExists(tableName: string): boolean {
    return this.tables.some((table) => table.name === tableName)
  }

  private getTable(tableName: string): TableDto {
    const table = this.tables.find((table) => table.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table
  }

  public async getDB(): Promise<Database> {
    return fs.readJSON(this.url)
  }

  public async setDB(db: Database): Promise<void> {
    await fs.writeJSON(this.url, db, { spaces: 2 })
  }

  async create(tableName: string, recordDto: RecordDto): Promise<string> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[tableName]) db[tableName] = []
      db[tableName].push(recordDto)
      await this.setDB(db)
      return String(recordDto.id)
    })
  }

  async createMany(table: string, recordsDto: RecordDto[]): Promise<string[]> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      db[table].push(...recordsDto)
      await this.setDB(db)
      return recordsDto.map((recordDto) => String(recordDto.id))
    })
  }

  async softUpdateById(table: string, recordDto: RecordDto, id: string): Promise<void> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      const index = db[table].findIndex((row) => row.id === id)
      if (index === -1) throw new Error(`Record ${id} not found`)
      db[table][index] = { ...db[table][index], ...recordDto }
      await this.setDB(db)
    })
  }

  async softUpdateMany(table: string, recordsDto: RecordDto[]): Promise<void> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      for (const recordDto of recordsDto) {
        const index = db[table].findIndex((row) => row.id === recordDto.id)
        if (index === -1) throw new Error(`Record ${recordDto.id} not found`)
        db[table][index] = { ...db[table][index], ...recordDto }
      }
      await this.setDB(db)
    })
  }

  async list(table: string, filters: FilterDto[] = []): Promise<RecordDto[]> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      const recordsDto = db[table]
      if (filters.length === 0) return recordsDto
      return recordsDto.filter((recordDto) => {
        for (const filter of filters) {
          const value = recordDto[filter.field]
          const field = this.getTable(table).fields.find((field) => field.name === filter.field)
          if (filter.operator === 'is_any_of') {
            if (!Array.isArray(filter.value)) throw new Error('Value must be an array')
            if (filter.field === 'id' || field?.format === 'text')
              return (
                filter.value.map((v) => String(v)).filter((v: string) => v === value).length > 0
              )
            if (field?.format === 'number')
              return (
                filter.value.map((v) => Number(v)).filter((v: number) => v === value).length > 0
              )
          }
          throw new Error(`Operator ${filter.operator} not supported`)
        }
      })
    })
  }

  async deleteById(table: string, id: string): Promise<void> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      const index = db[table].findIndex((recordDto) => recordDto.id === id)
      if (index === -1) throw new Error(`Record not found for id ${id} in table ${table}`)
      db[table].splice(index, 1)
      await this.setDB(db)
    })
  }

  async readById(table: string, id: string): Promise<RecordDto | undefined> {
    return this.withLock(async () => {
      const db = await this.getDB()
      if (!db[table]) db[table] = []
      const recordDto = db[table].find((row) => row.id === id)
      if (!recordDto) return undefined
      return recordDto
    })
  }
}
