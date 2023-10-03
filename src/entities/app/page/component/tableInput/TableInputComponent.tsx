import React from 'react'
import { TableInputComponentParams } from './TableInputComponentParams'
import { ComponentError } from '../ComponentError'
import { TableInputComponentUI } from './TableInputComponentUI'
import { PageServices } from '@entities/app/page/PageServices'
import { BaseComponent } from '../base/BaseComponent'
import { PageConfig } from '../../Page'
import { Table } from '@entities/app/table/Table'
import { FormInputComponentProps } from '../form/FormComponentUI'

export class TableInputComponent extends BaseComponent {
  readonly multipleLinkedRecordsTable: Table

  constructor(
    readonly params: TableInputComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { type, columns } = params
    super(params, services, config)
    if (!config.formTableName) {
      throw new ComponentError(type, 'table_input component should be placed inside a form')
    }
    const formTable = this.getTableByName(config.formTableName)
    const multipleLinkedRecordsField = formTable.getMultipleLinkedRecordsFieldByName(params.field)
    this.multipleLinkedRecordsTable = this.getTableByName(multipleLinkedRecordsField.table)
    for (const column of columns) {
      if (!this.multipleLinkedRecordsTable.hasColumn(column.field)) {
        throw new ComponentError(
          type,
          `field "${column.field}" in table_input columns is not defined in table "${this.multipleLinkedRecordsTable.name}"`
        )
      }
    }
  }

  async render() {
    return ({
      updateRecord,
      addRecord,
      removeRecord,
      records,
      currentRecord,
    }: FormInputComponentProps) => {
      const recordsIds = currentRecord?.getMultipleLinkedRecordsValue(this.params.field) ?? []
      const rows = records?.filter((record) => recordsIds.includes(record.id)) ?? []

      const handleAddRecord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (addRecord) addRecord(this.multipleLinkedRecordsTable.name)
      }

      const handleUpdateRecord = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        e.preventDefault()
        if (updateRecord) updateRecord(id, e.target.name, e.target.value)
      }

      const handleRemoveRecord = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: string
      ) => {
        e.preventDefault()
        if (removeRecord) removeRecord(this.params.field, id)
      }

      return (
        <TableInputComponentUI
          label={this.params.label}
          addLabel={this.params.addLabel}
          onAddRecord={handleAddRecord}
          onChangeRecord={handleUpdateRecord}
          onRemoveRecord={handleRemoveRecord}
          rows={rows}
          columns={this.params.columns}
          ui={this.services.ui}
          testId={this.params.testId}
        />
      )
    }
  }
}
