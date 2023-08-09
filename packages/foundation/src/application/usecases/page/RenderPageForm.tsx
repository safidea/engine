import React, { useRef, useState } from 'react'
import { Form } from '@domain/entities/page/components/Form'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { Record, RecordFieldValue } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'
import { IsAnyOf } from '@domain/entities/app/filters/IsAnyOf'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'

export class RenderPageForm {
  constructor(
    private fetcherGateway: FetcherGatewayAbstract,
    private app: App
  ) {}

  async execute(form: Form, context: Context): Promise<() => JSX.Element> {
    const UI = form.renderUI()
    const { tableName, inputs, recordIdToUpdate } = form
    const app = this.app
    const table = app.getTableByName(tableName)
    const InputComponents = inputs.map((input) => input.renderUI())
    const syncRecords = this.fetcherGateway.getSyncRecordsFunction()
    let defaultRecords: Record[]
    let defaultRecordId: string

    const getFormResources = (): SyncResource[] => {
      const resources: SyncResource[] = [
        {
          table: tableName,
          filters: [new IsAnyOf('id', [defaultRecordId])],
        },
      ]
      const tablesInputs = form.getTablesInputs()
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

    if (recordIdToUpdate) {
      defaultRecordId = context.getValue(recordIdToUpdate)
      const resources: SyncResource[] = getFormResources()
      const { tables, error } = await syncRecords({ resources })
      if (error) throw new Error('Sync records error: ' + error)
      defaultRecords = getRecordsFromTables(tables)
    } else {
      const record = new Record({}, table, 'create', false)
      defaultRecords = [record]
      defaultRecordId = record.id
    }

    return function FormComponent() {
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
          if (!form.submit.autosave) {
            const newRecord = new Record({}, table, 'create', false)
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
        if (form.submit.autosave === true) {
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
        const linkedTable = app.getTableByName(linkedTableName)
        const linkedField = linkedTable.getLinkedFieldByLinkedTableName(tableName)
        const newRecord = new Record(
          {
            [linkedField.name]: recordId,
          },
          linkedTable,
          'create',
          false
        )
        const { record, index } = getRecordFromId(recordId)
        const field = table.getLinkedFieldByLinkedTableName(linkedTableName)
        const recordsIds = record.getMultipleLinkedRecordsValue(field.name)
        records[index].setFieldValue(field.name, [...recordsIds, newRecord.id])
        records.push(newRecord)
        setRecords([...records])
        autosave()
      }

      const removeRecord = (field: string, id: string) => {
        const { index } = getRecordFromId(id)
        if (form.submit.autosave === true) {
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

      return (
        <UI
          saveRecords={saveRecords}
          updateRecord={updateRecord}
          addRecord={addRecord}
          removeRecord={removeRecord}
          InputComponents={InputComponents}
          isSaving={isSaving}
          errorMessage={errorMessage}
          records={records}
          currentRecord={currentRecord}
        />
      )
    }
  }
}
