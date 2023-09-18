import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { SingleSelectRecordInputComponentParams } from './SingleSelectRecordInputComponentParams'
import { Table } from '@entities/app/table/Table'
import { SingleSelectInputComponentUI } from '../singleSelect/SingleSelectInputComponentUI'
import { Record } from '@entities/services/database/record/Record'
import { FormConfig } from '../../FormComponent'
import { PageServices } from '@entities/app/page/PageServices'

export class SingleSelectRecordInputComponent extends BaseInputComponent {
  readonly table: Table
  readonly fieldForOptionLabel: string
  readonly placeholder?: string

  constructor(
    params: SingleSelectRecordInputComponentParams,
    services: PageServices,
    config: FormConfig
  ) {
    const { type, field, label, placeholder, table: tableName, fieldForOptionLabel } = params
    super({ type, field, label }, services, config)
    this.table = this.getTableByName(tableName)
    this.placeholder = placeholder
    this.fieldForOptionLabel = fieldForOptionLabel ?? 'id'
  }

  async render() {
    const useSyncRecords = this.services.fetcher.getSyncRecordsHook([{ table: this.table }])
    return ({ updateRecord, currentRecord }: BaseInputComponentProps) => {
      const { tables } = useSyncRecords()
      const value = currentRecord.getFieldValue(this.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      const records = tables[this.table.name] ?? []
      const options = records.map((record: Record) => ({
        label: String(record.getFieldValue(this.fieldForOptionLabel)),
        value: record.id,
      }))
      return (
        <SingleSelectInputComponentUI
          label={this.label}
          field={this.field}
          value={String(value)}
          options={options}
          onChange={handleUpdateRecord}
          ui={this.services.ui}
        />
      )
    }
  }
}
