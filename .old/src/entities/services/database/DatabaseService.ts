import { Filter, newFilter } from '@entities/services/database/filter/Filter'
import { Emit } from '@entities/app/automation/AutomationList'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { Table } from '@entities/app/table/Table'
import { IDatabaseMapper } from '@entities/services/database/IDatabaseMapper'
import { FormulaField } from '@entities/app/table/field/formula/FormulaField'
import { RollupField } from '@entities/app/table/field/rollup/RollupField'
import { MultipleLinkedRecordsField } from '@entities/app/table/field/multipleLinkedRecords/MultipleLinkedRecordsField'
import { Scripter } from '@entities/services/scripter/Scripter'
import { TableList } from '@entities/app/table/TableList'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { Sync, SyncRecordsByTable } from '../fetcher/sync/Sync'
import { RecordToPersite } from './record/Record'

export class DatabaseService {
  private emit?: Emit
  private tables: TableList | undefined

  constructor(private readonly mapper: IDatabaseMapper) {}

  async configure(tables: TableList): Promise<void> {
    this.tables = tables
    await this.mapper.configure(tables)
  }

  async listen(emit: Emit) {
    this.emit = emit
  }

  async tableExists(table: string): Promise<boolean> {
    return this.mapper.tableExists(table)
  }

  async create(table: Table, record: RecordToCreate): Promise<string> {
    const persistedRecord = await this.mapper.create(table, record)
    if (this.emit) await this.emitRecordCreatedEvent(persistedRecord, table)
    return persistedRecord.id
  }

  async createMany(table: Table, records: RecordToCreate[]): Promise<string[]> {
    const persistedRecords = await this.mapper.createMany(table, records)
    if (this.emit)
      for (const persistedRecord of persistedRecords)
        await this.emitRecordCreatedEvent(persistedRecord, table)
    return persistedRecords.map((record) => record.id)
  }

  async softUpdate(table: Table, record: RecordToUpdate): Promise<void> {
    const persistedRecord = await this.mapper.softUpdate(table, record)
    await this.emitRecordUpdatedEvent(record, persistedRecord, table)
  }

  async softUpdateMany(table: Table, records: RecordToUpdate[]): Promise<void> {
    const persistedRecords = await this.mapper.softUpdateMany(table, records)
    if (this.emit)
      for (const record of records) {
        const persistedRecord = persistedRecords.find((r) => r.id === record.id)
        if (!persistedRecord) throw new Error(`Record "${record.id}" has not been persisted`)
        await this.emitRecordUpdatedEvent(record, persistedRecord, table)
      }
  }

  async softDelete(table: Table, record: RecordToDelete): Promise<void> {
    await this.mapper.softDelete(table, record)
    //if (this.emit) await this.emit('record_deleted', { table: table.name, record: recordData })
  }

  async softDeleteMany(table: Table, records: RecordToDelete[]): Promise<void> {
    await this.mapper.softDeleteMany(table, records)
    //if (this.emit) for (const id of ids) await this.emit('record_deleted', { table: table.name, id })
  }

  async list(table: Table, filters: Filter[]): Promise<PersistedRecord[]> {
    const persistedRecords = await this.mapper.list(table, filters)
    return Promise.all(persistedRecords.map((record) => this.enrichPersistedRecord(record, table)))
  }

  async read(table: Table, id: string): Promise<PersistedRecord | undefined> {
    const persistedRecord = await this.mapper.read(table, id)
    if (!persistedRecord) return undefined
    return this.enrichPersistedRecord(persistedRecord, table)
  }

  async emitRecordCreatedEvent(record: PersistedRecord, table: Table) {
    if (!this.emit) return
    await this.enrichPersistedRecord(record, table)
    await this.emit({
      event: 'record_created',
      context: { table: table.name, record: record.dataWithLinkedRecordsData() },
    })
  }

  async emitRecordUpdatedEvent(
    recordToUpdate: RecordToUpdate,
    persistedRecord: PersistedRecord,
    table: Table
  ) {
    if (!this.emit) return
    await this.enrichPersistedRecord(persistedRecord, table)
    await this.emit({
      event: 'record_updated',
      context: {
        table: table.name,
        record: persistedRecord.dataWithLinkedRecordsData(),
        updatedFields: recordToUpdate.getUpdatedFieldsNames(),
      },
    })
  }

  private async enrichPersistedRecord(record: PersistedRecord, table: Table) {
    await this.runRecordFormulas(record, table)
    await this.replaceLinkedRecordsIdsByData(record, table)
    return record
  }

  private async runRecordFormulas(record: PersistedRecord, table: Table): Promise<void> {
    if (table.fields.length > 0) {
      for (const field of table.fields)
        if (field instanceof RollupField) {
          const value = await this.runFieldRollupFormula(record, field, table)
          record.setCalculatedFieldValue(field.name, value)
        }
      for (const field of table.fields)
        if (field instanceof FormulaField) {
          const value = await this.runFieldFormula(record, field)
          record.setCalculatedFieldValue(field.name, value)
        }
    }
  }

  private async runFieldRollupFormula(
    record: PersistedRecord,
    fieldRollup: RollupField,
    table: Table
  ) {
    const { formula } = fieldRollup
    const field = table.fields.find((f) => f.name === fieldRollup.linkedRecords)
    if (!field || !(field instanceof MultipleLinkedRecordsField))
      throw new Error(`Field "${fieldRollup.linkedRecords}" not found in runFieldRollupFormula`)
    const values = record.getFieldValue(field.name)
    if (!Array.isArray(values)) throw new Error('Values are not an array')
    const linkedRecords = await this.list(this.getTableByName(field.table), [
      newFilter({ field: 'id', operator: 'is_any_of', value: values }),
    ])
    const context = {
      values: linkedRecords.map((record) => String(record.getFieldValue(fieldRollup.linkedField))),
    }
    return new Scripter(formula, context).run()
  }

  private async runFieldFormula(record: PersistedRecord, fieldFormula: FormulaField) {
    const { formula } = fieldFormula
    return new Scripter(formula, record.data()).run()
  }

  private getTableByName(tableName: string): Table {
    const table = this.tables?.getByName(tableName)
    if (!table) throw new Error(`Table "${tableName}" not found`)
    return table
  }

  async replaceLinkedRecordsIdsByData(
    record: PersistedRecord,
    table: Table
  ): Promise<PersistedRecord> {
    for (const field of table.fields) {
      if (field instanceof MultipleLinkedRecordsField) {
        const ids = record.getMultipleLinkedRecordsValue(field.name)
        const linkedTable = this.getTableByName(field.table)
        const linkedRecords = await this.list(linkedTable, [
          newFilter({ field: 'id', operator: 'is_any_of', value: ids }),
        ])
        record.setMultipleLinkedRecordsFieldsData(
          field.name,
          linkedRecords.map((record) => record.data())
        )
      }
    }
    return record
  }

  async sync({ records, resources }: Sync) {
    if (records) {
      const recordsToCreate: { table: Table; records: RecordToCreate[] }[] = []
      const recordsToUpdate: { table: Table; records: RecordToUpdate[] }[] = []
      const recordsToDelete: { table: Table; records: RecordToDelete[] }[] = []
      const addRecord = (
        record: RecordToPersite,
        lists: { table: Table; records: (RecordToCreate | RecordToUpdate | RecordToDelete)[] }[]
      ) => {
        const list = lists.find((r) => r.table.name === record.table.name)
        if (list) {
          list.records.push(record)
        } else {
          lists.push({
            table: record.table,
            records: [record],
          })
        }
      }
      for (const record of records) {
        if (record instanceof RecordToCreate) {
          addRecord(record, recordsToCreate)
        } else if (record instanceof RecordToUpdate) {
          addRecord(record, recordsToUpdate)
        } else if (record instanceof RecordToDelete) {
          addRecord(record, recordsToDelete)
        }
      }
      const persistedCreatedRecords = []
      for (const { table, records } of recordsToCreate) {
        persistedCreatedRecords.push(...(await this.mapper.createMany(table, records)))
      }
      const persistedUpdatedRecords = []
      for (const { table, records } of recordsToUpdate) {
        persistedUpdatedRecords.push(...(await this.mapper.softUpdateMany(table, records)))
      }
      for (const { table, records } of recordsToDelete) {
        await this.mapper.softDeleteMany(table, records)
      }
      if (this.emit) {
        for (const record of persistedCreatedRecords) {
          await this.emitRecordCreatedEvent(record, record.table)
        }
        for (const record of persistedUpdatedRecords) {
          const recordToUpdate = recordsToUpdate
            .find((r) => r.table.name === record.table.name)
            ?.records.find((r) => r.id === record.id)
          if (!recordToUpdate) throw new Error(`Record "${record.id}" has not been updated`)
          await this.emitRecordUpdatedEvent(recordToUpdate, record, record.table)
        }
      }
    }

    const tables: SyncRecordsByTable = {}
    const promises = []
    for (const { table, filters = [] } of resources) {
      promises.push(this.list(table, filters).then((records) => (tables[table.name] = records)))
    }
    await Promise.all(promises)
    return tables
  }
}
