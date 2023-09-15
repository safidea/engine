import { Filter } from '@entities/services/database/filter/Filter'
import { TableParams } from '@entities/app/table/TableParams'
import { Emit } from '@entities/app/automation/AutomationList'
import { IDatabaseDriver } from './IDatabaseDriver'
import { RecordToCreate } from '../../../entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from '../../../entities/services/database/record/state/toUpdate/RecordToUpdate'
import { PersistedRecord } from '../../../entities/services/database/record/state/persisted/PersistedRecord'
import { Table } from '@entities/app/table/Table'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'

export class DatabaseService implements IDatabaseService {
  private emit?: Emit

  constructor(private readonly driver: IDatabaseDriver) {}

  async configure(tables: TableParams[]): Promise<void> {
    await this.driver.configure(tables)
  }

  async listen(emit: Emit) {
    this.emit = emit
  }

  async tableExists(table: string): Promise<boolean> {
    return this.driver.tableExists(table)
  }

  async create(table: Table, record: RecordToCreate): Promise<string> {
    const recordData = record.data()
    const id = await this.driver.create(table.name, recordData)
    if (this.emit) await this.emit('record_created', { table: table.name, record: recordData })
    return id
  }

  async createMany(table: Table, records: RecordToCreate[]): Promise<string[]> {
    const recordsData = records.map((r) => r.data())
    const ids = await this.driver.createMany(table.name, recordsData)
    if (this.emit)
      for (const recordData of recordsData)
        await this.emit('record_created', { table: table.name, record: recordData })
    return ids
  }

  async update(table: Table, record: RecordToUpdate): Promise<void> {
    const recordData = record.toUpdateData()
    await this.driver.softUpdate(table.name, recordData)
    if (this.emit) await this.emit('record_updated', { table: table.name, record: recordData })
  }

  async updateMany(table: Table, records: RecordToUpdate[]): Promise<void> {
    const recordsData = records.map((r) => r.toUpdateData())
    await this.driver.softUpdateMany(table.name, recordsData)
    if (this.emit)
      for (const recordData of recordsData)
        await this.emit('record_updated', { table: table.name, record: recordData })
  }

  async list(table: Table, filters: Filter[]): Promise<PersistedRecord[]> {
    const filtersParams = filters.map((f) => f.params)
    const recordsData = await this.driver.list(table.name, filtersParams)
    return recordsData.map((recordData) => new PersistedRecord(recordData, table))
  }

  async read(table: Table, id: string): Promise<PersistedRecord | undefined> {
    const recordData = await this.driver.read(table.name, id)
    if (!recordData) return undefined
    return new PersistedRecord(recordData, table)
  }
}
