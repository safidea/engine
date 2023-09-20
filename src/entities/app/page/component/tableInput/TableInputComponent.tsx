import React from 'react'
import { TableInputComponentParams } from './TableInputComponentParams'
import { ComponentError } from '../ComponentError'
import { TableInputComponentUI } from './TableInputComponentUI'
import { PageServices } from '@entities/app/page/PageServices'
import { BaseComponent } from '../base/BaseComponent'
import { PageConfig } from '../../Page'
import { Table } from '@entities/app/table/Table'
import { BaseComponentProps } from '../base/BaseComponentProps'

export class TableInputComponent extends BaseComponent {
  readonly table: Table

  constructor(
    readonly params: TableInputComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { type, columns } = params
    super({ type }, services, config)
    if (!config.formTableName) {
      throw new ComponentError(type, 'table_input component should be placed inside a form')
    }
    this.table = this.getTableByName(config.formTableName)
    for (const column of columns) {
      if (!this.table.hasColumn(column.field)) {
        throw new ComponentError(
          type,
          `field ${column.field} in table input columns is not defined in table ${this.table.name}`
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
    }: BaseComponentProps) => {
      const recordsIds = currentRecord?.getMultipleLinkedRecordsValue(this.params.field) ?? []
      const rows = records?.filter((record) => recordsIds.includes(record.id)) ?? []

      const handleAddRecord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (addRecord) addRecord(this.table.name)
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
        />
      )
    }
  }
}
