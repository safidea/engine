import React, { useRef, useState } from 'react'
import { PageConfig } from '../../Page'
import { FormComponentOptions } from './FormComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { BaseComponent } from '../base/BaseComponent'
import { FormComponentUI } from './FormComponentUI'
import { Table } from '@entities/app/table/Table'
import { Record } from '@entities/drivers/database/Record'
import { RecordFieldValue } from '@entities/drivers/database/Record/IRecord'
import { SyncResource, SyncTables } from '@entities/drivers/database/Sync'
import { IsAnyOfFilter } from '@entities/drivers/database/filters/IsAnyOfFilter'
import { InputComponent, newInput } from './input/InputComponent'
import { TableInputComponent } from './input/table/TableInputComponent'
import { Context } from '../../Context'

export interface FormConfig extends PageConfig {
  formTableName: string
}

export class FormComponent extends BaseComponent {
  readonly inputs: InputComponent[]
  readonly submit: FormComponentOptions['submit']
  readonly recordIdToUpdate?: string
  readonly table: Table

  constructor(options: FormComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, submit, recordIdToUpdate, table: tableName, inputs } = options
    super({ type }, drivers, config)
    this.submit = submit
    this.recordIdToUpdate = recordIdToUpdate
    this.table = this.getTableByName(tableName)
    this.inputs = inputs.map((input) =>
      newInput(input, drivers, { ...config, formTableName: tableName })
    )
  }

  async render(context: Context) {
    const syncRecords = this.drivers.fetcher.getSyncRecordsFunction()
    let defaultRecords: Record[]
    let defaultRecordId: string

    const getFormResources = (): SyncResource[] => {
      const resources: SyncResource[] = [
        {
          table: this.table.name,
          filters: [new IsAnyOfFilter('id', [defaultRecordId])],
        },
      ]
      const tablesInputs = this.inputs.filter((input) => input instanceof TableInputComponent)
      for (const tableInput of tablesInputs) {
        resources.push({
          table: tableInput.table.name,
        })
      }
      return resources
    }

    const getRecordsFromTables = (tables: SyncTables): Record[] => {
      const records: Record[] = []
      for (const record of Object.values(tables).flat()) {
        if (record) records.push(record)
      }
      return records
    }

    if (this.recordIdToUpdate) {
      defaultRecordId = context.getValue(this.recordIdToUpdate)
      const resources: SyncResource[] = getFormResources()
      const { tables, error } = await syncRecords({ resources })
      if (error) throw new Error('Sync records error: ' + error)
      defaultRecords = getRecordsFromTables(tables)
    } else {
      const record = new Record({}, this.table, 'create', false)
      defaultRecords = [record]
      defaultRecordId = record.id
    }

    return () => {
      const [isSaving, setIsSaving] = useState(false)
      const [recordId, setRecordId] = useState<string>(defaultRecordId)
      const [records, setRecords] = useState<Record[]>(defaultRecords)
      const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
      const timeoutRef = useRef<NodeJS.Timeout | null>(null)

      const getRecordFromId = (id: string) => {
        const record = records.find((record) => record.id === id)
        if (!record) throw new Error(`record with id ${id} not found`)
        return { record, index: records.indexOf(record) }
      }

      const saveRecords = async () => {
        if (isSaving === false) setIsSaving(true)
        const resources = getFormResources()
        const { error, tables } = await syncRecords({ records, resources })
        if (error) {
          setErrorMessage(error)
        } else {
          if (!this.submit.autosave) {
            const newRecord = new Record({}, this.table, 'create', false)
            setRecordId(newRecord.id)
            setRecords([newRecord])
          } else {
            const newRecords = getRecordsFromTables(tables)
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
        const { index } = getRecordFromId(id)
        records[index].setFieldValue(field, value)
        setRecords([...records])
        autosave()
      }

      const addRecord = (linkedTableName: string) => {
        const linkedTable = this.getTableByName(linkedTableName)
        const linkedField = linkedTable.getLinkedFieldByLinkedTableName(this.table.name)
        const newRecord = new Record(
          {
            [linkedField.name]: recordId,
          },
          linkedTable,
          'create',
          false
        )
        const { record, index } = getRecordFromId(recordId)
        const field = this.table.getLinkedFieldByLinkedTableName(linkedTableName)
        const recordsIds = record.getMultipleLinkedRecordsValue(field.name)
        records[index].setFieldValue(field.name, [...recordsIds, newRecord.id])
        records.push(newRecord)
        setRecords([...records])
        autosave()
      }

      const removeRecord = (field: string, id: string) => {
        const { index } = getRecordFromId(id)
        if (this.submit.autosave === true) {
          records[index].softDelete()
        } else {
          records.splice(index, 1)
        }
        const { record: currentRecord, index: currentIndex } = getRecordFromId(recordId)
        const recordsIds = currentRecord.getMultipleLinkedRecordsValue(field)
        records[currentIndex].setFieldValue(
          field,
          recordsIds.filter((recordId) => recordId !== id)
        )
        setRecords([...records])
        autosave()
      }

      const currentRecord = records.find((record) => record.id === recordId)
      if (!currentRecord) throw new Error(`Record with id ${recordId} not found`)

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
          InputsComponents={this.inputs.map((input) => input.render())}
          isSaving={isSaving}
          errorMessage={errorMessage}
          records={records}
          currentRecord={currentRecord}
          submit={this.submit}
          ui={this.drivers.ui}
        />
      )
    }
  }
}
