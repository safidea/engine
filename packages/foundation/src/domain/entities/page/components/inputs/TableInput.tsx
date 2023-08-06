import React from 'react'
import { UI } from '@adapter/spi/ui/UI'
import { BaseInput, BaseInputProps } from './BaseInput'
import { Table } from '@domain/entities/table/Table'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export type Row = {
  [key: string]: string
}

export class TableInput extends BaseInput {
  constructor(
    field: string,
    private readonly _columns: Column[],
    private readonly _table: Table,
    private readonly _ui: UI['TableInputUI'],
    label?: string,
    private readonly _addLabel?: string
  ) {
    super('text', field, label)
    for (const column of this._columns) {
      if (!this._table.hasColumn(column.field)) {
        throw new Error(
          `field ${column.field} in table input columns is not defined in table ${this._table.name}`
        )
      }
    }
  }

  get columns() {
    return this._columns
  }

  get addLabel() {
    return this._addLabel
  }

  renderUI() {
    const UI = this._ui
    const label = this.label
    const addLabel = this.addLabel
    const columns = this.columns
    const field = this.field
    const tableName = this._table.name
    return function TableInputUI({
      updateRecord,
      addRecord,
      records,
      currentRecord,
    }: BaseInputProps) {
      const recordsIds = currentRecord.getMultipleLinkedRecordsValue(field)
      const rows = records.filter((record) => recordsIds.includes(record.id))

      const handleAddRecord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addRecord(tableName)
      }

      const handleUpdateRecord = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        updateRecord(id, e.target.name, e.target.value)
      }

      return (
        <UI.container>
          {(label || addLabel) && (
            <UI.menu>
              {label && <UI.label label={label} />}
              {addLabel && <UI.addButton label={addLabel} onClick={handleAddRecord} />}
            </UI.menu>
          )}
          <UI.table>
            <UI.header>
              {columns.map((column) => (
                <UI.headerColumn key={column.field} label={column.label} />
              ))}
            </UI.header>
            <UI.rows>
              {rows.map((row) => (
                <UI.row key={row.id}>
                  {columns.map((column) => (
                    <UI.cell
                      key={column.field}
                      name={column.field}
                      placeholder={column.placeholder}
                      value={String(row.getFieldValue(column.field) ?? '')}
                      onChange={(e) => handleUpdateRecord(row.id, e)}
                    />
                  ))}
                </UI.row>
              ))}
            </UI.rows>
          </UI.table>
        </UI.container>
      )
    }
  }
}
