import { Filter } from '@entities/drivers/database/filter/Filter'
import { TableOptions } from '@entities/app/table/TableOptions'
import { Emit } from '@entities/app/automation/AutomationList'
import { DatabaseDriver } from './DatabaseDriver'
import { RecordToCreate } from './record/state/RecordToCreate'
import { RecordToUpdate } from './record/state/RecordToUpdate'
import { PersistedRecord } from './record/state/PersistedRecord'
import { Table } from '@entities/app/table/Table'

export class Database {
  private emit?: Emit

  constructor(private readonly driver: DatabaseDriver) {}

  async configure(tables: TableOptions[]): Promise<void> {
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
    const recordData = record.data()
    await this.driver.softUpdate(table.name, recordData)
    if (this.emit) await this.emit('record_updated', { table: table.name, record: recordData })
  }

  async updateMany(table: Table, records: RecordToUpdate[]): Promise<void> {
    const recordsData = records.map((r) => r.data())
    await this.driver.softUpdateMany(table.name, recordsData)
    if (this.emit)
      for (const recordData of recordsData)
        await this.emit('record_updated', { table: table.name, record: recordData })
  }

  async list(table: Table, filters: Filter[]): Promise<PersistedRecord[]> {
    const filtersOptions = filters.map((f) => f.options)
    const recordsData = await this.driver.list(table.name, filtersOptions)
    return recordsData.map((recordData) => new PersistedRecord(recordData, table))
  }

  async read(table: Table, id: string): Promise<PersistedRecord | undefined> {
    const recordData = await this.driver.read(table.name, id)
    if (!recordData) return undefined
    return new PersistedRecord(recordData, table)
  }
}
