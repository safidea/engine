import fs from 'fs-extra'
import { join } from 'path'

import { RecordDto, RecordFieldValueDto } from '@adapters/spi/orm/dtos/RecordDto'
import { FilterDto } from '@entities/drivers/database/filter/FilterParams'
import { DatabaseDriver } from '@entities/drivers/database/DatabaseDriver'

interface TableRecord {
  [key: string]: RecordFieldValueDto
}
interface Database {
  [key: string]: TableRecord[]
}

export class JsonDatabase implements DatabaseDriver {
  private url: string
  private tables: TableDto[] = []

  constructor(folder: string) {
    this.url = join(folder, 'db.json')
    if (fs.existsSync(this.url)) return
    fs.ensureFileSync(this.url)
    fs.writeJSONSync(this.url, {})
  }

  public async configure(tables: TableDto[]): Promise<void> {
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
    return fs.readJSON(this.url, { throws: false }) || {}
  }

  public async setDB(db: Database): Promise<void> {
    await fs.outputJSON(this.url, db, { spaces: 2 })
  }

  async create(tableName: string, recordDto: RecordDto): Promise<string> {
    const db = await this.getDB()
    if (!db[tableName]) db[tableName] = []
    const autonumberField = this.getTable(tableName).fields.find(
      (field) => field.type === 'autonumber'
    )
    if (autonumberField) {
      const autonumber = db[tableName].length + 1
      recordDto = { ...recordDto, [autonumberField.name]: autonumber }
    }
    db[tableName].push(recordDto)
    await this.setDB(db)
    return String(recordDto.id)
  }

  async createMany(tableName: string, recordsDto: RecordDto[]): Promise<string[]> {
    const db = await this.getDB()
    if (!db[tableName]) db[tableName] = []
    const autonumberField = this.getTable(tableName).fields.find(
      (field) => field.type === 'autonumber'
    )
    if (autonumberField) {
      const autonumber = db[tableName].length + 1
      recordsDto = recordsDto.map((recordDto) => ({
        ...recordDto,
        [autonumberField.name]: autonumber,
      }))
    }
    db[tableName].push(...recordsDto)
    await this.setDB(db)
    return recordsDto.map((recordDto) => String(recordDto.id))
  }

  async softUpdateById(table: string, recordDto: RecordDto, id: string): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((row) => row.id === id)
    if (index === -1) throw new Error(`Record ${id} not found`)
    db[table][index] = { ...db[table][index], ...recordDto }
    await this.setDB(db)
  }

  async softUpdateMany(table: string, recordsDto: RecordDto[]): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    for (const recordDto of recordsDto) {
      const index = db[table].findIndex((row) => row.id === recordDto.id)
      if (index === -1) throw new Error(`Record ${recordDto.id} not found`)
      db[table][index] = { ...db[table][index], ...recordDto }
    }
    await this.setDB(db)
  }

  async list(table: string, filters: FilterDto[] = []): Promise<RecordDto[]> {
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
            return filter.value.map((v) => String(v)).filter((v: string) => v === value).length > 0
          if (field?.format === 'number')
            return filter.value.map((v) => Number(v)).filter((v: number) => v === value).length > 0
        }
        throw new Error(`Operator ${filter.operator} not supported`)
      }
    })
  }

  async deleteById(table: string, id: string): Promise<void> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const index = db[table].findIndex((recordDto) => recordDto.id === id)
    if (index === -1) throw new Error(`Record not found for id ${id} in table ${table}`)
    db[table].splice(index, 1)
    await this.setDB(db)
  }

  async readById(table: string, id: string): Promise<RecordDto | undefined> {
    const db = await this.getDB()
    if (!db[table]) db[table] = []
    const recordDto = db[table].find((row) => row.id === id)
    if (!recordDto) return undefined
    return recordDto
  }
}
