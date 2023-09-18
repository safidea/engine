import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { TableInputComponentParams } from './TableInputComponentParams'
import { FormConfig } from '../../FormComponent'
import { ComponentError } from '../../../ComponentError'
import { TableInputComponentUI } from './TableInputComponentUI'
import { PageServices } from '@entities/app/page/PageServices'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export class TableInputComponent extends BaseInputComponent {
  readonly addLabel?: string
  readonly columns: Column[]

  constructor(params: TableInputComponentParams, services: PageServices, config: FormConfig) {
    const { type, field, label, addLabel, columns } = params
    super({ type, field, label }, services, config)
    for (const column of columns) {
      if (!this.table.hasColumn(column.field)) {
        throw new ComponentError(
          type,
          `field ${column.field} in table input columns is not defined in table ${this.table.name}`
        )
      }
    }
    this.addLabel = addLabel
    this.columns = columns
  }

  async render() {
    return ({
      updateRecord,
      addRecord,
      removeRecord,
      records,
      currentRecord,
    }: BaseInputComponentProps) => {
      const recordsIds = currentRecord.getMultipleLinkedRecordsValue(this.field)
      const rows = records.filter((record) => recordsIds.includes(record.id))

      const handleAddRecord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addRecord(this.table.name)
      }

      const handleUpdateRecord = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        e.preventDefault()
        updateRecord(id, e.target.name, e.target.value)
      }

      const handleRemoveRecord = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: string
      ) => {
        e.preventDefault()
        removeRecord(this.field, id)
      }

      return (
        <TableInputComponentUI
          label={this.label}
          addLabel={this.addLabel}
          onAddRecord={handleAddRecord}
          onChangeRecord={handleUpdateRecord}
          onRemoveRecord={handleRemoveRecord}
          rows={rows}
          columns={this.columns}
          ui={this.services.ui}
        />
      )
    }
  }
}