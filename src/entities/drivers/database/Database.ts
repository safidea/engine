import { Record } from '@entities/drivers/database/record'
import { Filter } from '@entities/drivers/database/filter/Filter'
import { TableOptions } from '@entities/app/table/TableOptions'
import { Emit } from '@entities/app/automation/AutomationList'
import { DatabaseDriver } from './DatabaseDriver'

export class Database {
  private emit?: Emit

  constructor(private readonly driver: DatabaseDriver) {}

  async configure(tables: TableOptions[]): Promise<void> {
    await this.driver.configure(tables)
  }

  async listen(emit: Emit) {
    this.emit = emit
  }

  async tableExists(table: string) {
    return this.driver.tableExists(table)
  }

  async create(table: string, record: Record) {
    const recordDto = RecordMapper.toDto(record)
    const createdRecord = await this.driver.create(table, recordDto)
    if (this.emit) await this.emit('record_created', { table, record: createdRecord })
    return createdRecord
  }

  async createMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    const createdRecords = await this.driver.createMany(table, recordsDto)
    if (this.emit)
      for (const createdRecord of createdRecords)
        await this.emit('record_created', { table, record: createdRecord })
    return createdRecords
  }

  async update(table: string, record: Record, id: string) {
    const recordDto = RecordMapper.toDto(record)
    await this.driver.softUpdateById(table, recordDto, id)
    if (this.emit) await this.emit('record_updated', { table, record: recordDto })
  }

  async updateMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    await this.driver.softUpdateMany(table, recordsDto)
    if (this.emit)
      for (const record of recordsDto) await this.emit('record_updated', { table, record })
  }

  async list(table: string, filters: Filter[]) {
    const filtersDto = FilterMapper.toDtos(filters)
    const recordsDto = await this.driver.list(table, filtersDto)
    return RecordMapper.toEntities(recordsDto, this.app.getTableByName(table))
  }

  async read(table: string, id: string) {
    const recordDto = await this.driver.readById(table, id)
    if (!recordDto) return undefined
    return RecordMapper.toEntity(recordDto, this.app.getTableByName(table))
  }
}
