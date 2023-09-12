import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { TableInputComponentOptions } from './TableInputComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { FormConfig } from '../../FormComponent'
import { ComponentError } from '../../../ComponentError'
import { TableInputComponentUI } from './TableInputComponentUI'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export class TableInput extends BaseInputComponent {
  readonly addLabel?: string
  readonly columns: Column[]

  constructor(options: TableInputComponentOptions, drivers: AppDrivers, config: FormConfig) {
    const { type, field, label, addLabel, columns } = options
    super({ type, field, label }, drivers, config)
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

  render() {
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
          ui={this.drivers.ui}
        />
      )
    }
  }
}
