import React, { useState } from 'react'
import { Form } from '@domain/entities/page/components/Form'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { Record, RecordFieldValue } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'
import { IsAnyOf } from '@domain/entities/app/filters/IsAnyOf'
import { SyncResource } from '@domain/entities/app/Sync'

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

    if (recordIdToUpdate) {
      defaultRecordId = context.getValue(recordIdToUpdate)
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
      const { tables, error } = await syncRecords({ resources })
      if (error) {
        throw new Error(error)
      }
      defaultRecords = []
      for (const record of Object.values(tables).flat()) {
        if (record) defaultRecords.push(record)
      }
    } else {
      const record = new Record({}, table, 'create')
      defaultRecords = [record]
      defaultRecordId = record.id
    }

    return function FormComponent() {
      const [isSaving, setIsSaving] = useState(false)
      const [recordId, setRecordId] = useState<string>(defaultRecordId)
      const [records, setRecords] = useState<Record[]>(defaultRecords)
      const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

      const getRecordFromId = (id: string) => {
        const record = records.find((record) => record.id === id)
        if (!record) throw new Error(`Record with id ${id} not found`)
        return { record, index: records.indexOf(record) }
      }

      const saveRecords = async () => {
        setIsSaving(true)
        const { error } = await syncRecords({ records })
        if (error) {
          setErrorMessage(error)
        } else {
          const newRecord = new Record({}, table, 'create')
          setRecordId(newRecord.id)
          setRecords([newRecord])
        }
        setIsSaving(false)
      }

      const updateRecord = (id: string, field: string, value: RecordFieldValue) => {
        const { index } = getRecordFromId(id)
        records[index].setFieldValue(field, value)
        setRecords([...records])
      }

      const addRecord = (linkedTableName: string) => {
        const linkedTable = app.getTableByName(linkedTableName)
        const linkedField = linkedTable.getLinkedFieldByLinkedTableName(tableName)
        const newRecord = new Record(
          {
            [linkedField.name]: recordId,
          },
          linkedTable,
          'create'
        )
        const { record, index } = getRecordFromId(recordId)
        const field = table.getLinkedFieldByLinkedTableName(linkedTableName)
        const recordsIds = record.getMultipleLinkedRecordsValue(field.name)
        records[index].setFieldValue(field.name, [...recordsIds, newRecord.id])
        setRecords([...records, newRecord])
      }

      const currentRecord = records.find((record) => record.id === recordId)
      if (!currentRecord) throw new Error(`Record with id ${recordId} not found`)

      return (
        <UI
          saveRecords={saveRecords}
          updateRecord={updateRecord}
          addRecord={addRecord}
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
