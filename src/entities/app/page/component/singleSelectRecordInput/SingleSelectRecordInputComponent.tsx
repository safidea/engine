import React from 'react'
import { SingleSelectRecordInputComponentParams } from './SingleSelectRecordInputComponentParams'
import { Table } from '@entities/app/table/Table'
import { SingleSelectInputComponentUI } from '../singleSelectInput/SingleSelectInputComponentUI'
import { Record } from '@entities/services/database/record/Record'
import { PageServices } from '@entities/app/page/PageServices'
import { BaseComponent } from '../base/BaseComponent'
import { PageConfig } from '../../Page'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { ComponentError } from '../ComponentError'

export class SingleSelectRecordInputComponent extends BaseComponent {
  readonly table: Table
  readonly fieldForOptionLabel: string

  constructor(
    readonly params: SingleSelectRecordInputComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { type, fieldForOptionLabel } = params
    super({ type }, services, config)
    if (!config.formTableName) {
      throw new ComponentError(
        type,
        'single_select_record_input component should be placed inside a form'
      )
    }
    this.table = this.getTableByName(config.formTableName)
    this.fieldForOptionLabel = fieldForOptionLabel ?? 'id'
  }

  async render() {
    const useSyncRecords = this.services.fetcher.getSyncRecordsHook([{ table: this.table }])
    return ({ updateRecord, currentRecord }: BaseComponentProps) => {
      const { tables } = useSyncRecords()
      const value = currentRecord?.getFieldValue(this.params.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        if (updateRecord && currentRecord)
          updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      const records = tables[this.table.name] ?? []
      const options = records.map((record: Record) => ({
        label: String(record.getFieldValue(this.fieldForOptionLabel)),
        value: record.id,
      }))
      return (
        <SingleSelectInputComponentUI
          label={this.params.label}
          field={this.params.field}
          value={String(value)}
          options={options}
          onChange={handleUpdateRecord}
          ui={this.services.ui}
        />
      )
    }
  }
}
