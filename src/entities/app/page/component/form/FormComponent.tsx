import React, { useRef, useState } from 'react'
import { PageConfig } from '../../Page'
import { FormComponentParams } from './FormComponentParams'
import { BaseComponent } from '../base/BaseComponent'
import { FormComponentUI } from './FormComponentUI'
import { Table } from '@entities/app/table/Table'
import { Record, RecordToPersite } from '@entities/services/database/record/Record'
import { InputComponent, newInput } from './input/InputComponent'
import { TableInputComponent } from './input/table/TableInputComponent'
import { Context } from '../../context/Context'
import { ComponentError } from '../ComponentError'
import { newFilter } from '@entities/services/database/filter/Filter'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { RecordFieldValue } from '@entities/services/database/record/RecordData'
import { SyncRecordsByTable, SyncResource } from '@entities/services/fetcher/sync/Sync'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { PageServices } from '../../PageServices'

export interface FormConfig extends PageConfig {
  formTableName: string
}

export class FormComponent extends BaseComponent {
  readonly inputs: InputComponent[]
  readonly submit: FormComponentParams['submit']
  readonly recordIdToUpdate?: string
  readonly table: Table

  constructor(params: FormComponentParams, services: PageServices, config: PageConfig) {
    const { type, submit, recordIdToUpdate, table: tableName, inputs } = params
    super({ type }, services, config)
    this.submit = submit
    this.recordIdToUpdate = recordIdToUpdate
    this.table = this.getTableByName(tableName)
    this.inputs = inputs.map((input) =>
      newInput(input, services, { ...config, formTableName: tableName })
    )
  }

  async render(context: Context) {
    const syncRecords = this.services.fetcher.getSyncRecordsFunction()
    let defaultRecords: Record[]
    let defaultRecordId: string

    if (this.recordIdToUpdate) {
      defaultRecordId = context.getValue(this.recordIdToUpdate)
      const resources: SyncResource[] = this.getFormResources(defaultRecordId)
      const { tables, error } = await syncRecords({ resources })
      if (error) throw new Error('Sync records error: ' + error)
      defaultRecords = this.getRecordsFromTables(tables)
    } else {
      const record = new RecordToCreate({}, this.table)
      defaultRecords = [record]
      defaultRecordId = record.id
    }

    const InputsComponents = await Promise.all(this.inputs.map((input) => input.render()))

    return () => {
      const [isSaving, setIsSaving] = useState(false)
      const [recordId, setRecordId] = useState<string>(defaultRecordId)
      const [records, setRecords] = useState<Record[]>(defaultRecords)
      const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
      const timeoutRef = useRef<NodeJS.Timeout | null>(null)

      const saveRecords = async () => {
        if (isSaving === false) setIsSaving(true)
        const resources = this.getFormResources(recordId)
        const recordToPersist = this.getRecordsToPersist(records)
        const { error, tables } = await syncRecords({ records: recordToPersist, resources })
        if (error) {
          setErrorMessage(error)
        } else {
          if (!this.submit.autosave) {
            const newRecord = new RecordToCreate({}, this.table)
            setRecordId(newRecord.id)
            setRecords([newRecord])
          } else {
            const newRecords = this.getRecordsFromTables(tables)
            setRecords(newRecords)
          }
          if (errorMessage) setErrorMessage(undefined)
        }
        setIsSaving(false)
      }

      const autosave = () => {
        if (this.submit.autosave === true) {
          setIsSaving(true)
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => {
            saveRecords()
          }, 1000)
        }
      }

      const updateRecord = (id: string, field: string, value: RecordFieldValue) => {
        const { index } = this.getRecordFromId(id, records)
        records[index] = this.updateRecord(records[index], field, value)
        setRecords([...records])
        autosave()
      }

      const addRecord = (linkedTableName: string) => {
        const linkedTable = this.getTableByName(linkedTableName)
        const linkedField = linkedTable.getLinkedFieldByLinkedTableName(this.table.name)
        const newRecord = new RecordToCreate(
          {
            [linkedField.name]: recordId,
          },
          linkedTable
        )
        const { record, index } = this.getRecordFromId(recordId, records)
        const field = this.table.getLinkedFieldByLinkedTableName(linkedTableName)
        const recordsIds = record.getMultipleLinkedRecordsValue(field.name)
        records[index] = this.updateRecord(record, field.name, [...recordsIds, newRecord.id])
        records.push(newRecord)
        setRecords([...records])
        autosave()
      }

      const removeRecord = (field: string, id: string) => {
        const { index } = this.getRecordFromId(id, records)
        const record = records[index]
        if (this.submit.autosave === true) {
          if (record instanceof PersistedRecord || record instanceof RecordToUpdate)
            records[index] = record.softDelete()
        } else {
          records.splice(index, 1)
        }
        const { record: currentRecord, index: currentIndex } = this.getRecordFromId(
          recordId,
          records
        )
        const recordsIds = currentRecord.getMultipleLinkedRecordsValue(field)
        records[currentIndex] = this.updateRecord(
          records[currentIndex],
          field,
          recordsIds.filter((recordId) => recordId !== id)
        )
        setRecords([...records])
        autosave()
      }

      const currentRecord = records.find((record) => record.id === recordId)
      if (!currentRecord)
        throw new ComponentError(this.type, `Record with id ${recordId} not found`)

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await saveRecords()
      }

      return (
        <FormComponentUI
          onSubmit={handleSubmit}
          saveRecords={saveRecords}
          updateRecord={updateRecord}
          addRecord={addRecord}
          removeRecord={removeRecord}
          InputsComponents={InputsComponents}
          isSaving={isSaving}
          errorMessage={errorMessage}
          records={records}
          currentRecord={currentRecord}
          submit={this.submit}
          ui={this.services.ui}
        />
      )
    }
  }

  private getFormResources(defaultRecordId: string): SyncResource[] {
    const resources: SyncResource[] = [
      {
        table: this.table,
        filters: [newFilter({ field: 'id', operator: 'is_any_of', value: [defaultRecordId] })],
      },
    ]
    const tablesInputs = this.inputs.filter((input) => input instanceof TableInputComponent)
    for (const tableInput of tablesInputs) {
      resources.push({
        table: tableInput.table,
      })
    }
    return resources
  }

  private getRecordsToPersist(records: Record[]): RecordToPersite[] {
    const recordsToPersist: RecordToPersite[] = []
    for (const record of records) {
      if (
        record instanceof RecordToCreate ||
        record instanceof RecordToUpdate ||
        record instanceof RecordToDelete
      ) {
        recordsToPersist.push(record)
      }
    }
    return recordsToPersist
  }

  private getRecordsFromTables(tables: SyncRecordsByTable): Record[] {
    const records: Record[] = []
    for (const record of Object.values(tables).flat()) {
      if (record) records.push(record)
    }
    return records
  }

  private getRecordFromId(id: string, records: Record[]) {
    const record = records.find((record) => record.id === id)
    if (!record) throw new ComponentError(this.type, `record with id ${id} not found`)
    return { record, index: records.indexOf(record) }
  }

  private updateRecord(record: Record, field: string, value: RecordFieldValue) {
    if (record instanceof RecordToCreate) {
      record.setFieldValue(field, value)
    } else if (record instanceof RecordToUpdate) {
      record.updateFieldValue(field, value)
    } else if (record instanceof PersistedRecord) {
      record = record.updateFieldValue(field, value)
    }
    return record
  }
}
