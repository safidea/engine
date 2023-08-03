import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseInput } from './BaseInput'
import { FormInputValue, HandleChange } from '../Form'
import { Table } from '@domain/entities/table/Table'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export type Row = {
  [key: string]: string
}

export interface TableInputProps {
  handleChange: HandleChange
  formData: { [key: string]: FormInputValue }
}

export class TableInput extends BaseInput {
  constructor(
    field: string,
    private readonly _columns: Column[],
    private readonly _table: Table,
    private readonly _ui: IUIGateway['TableInputUI'],
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
    return function Component({ handleChange, formData }: TableInputProps) {
      const fieldValue = formData[field]
      let rows: { [key: string]: string }[] = [{}]
      if (fieldValue && typeof fieldValue === 'object') {
        if ('create' in fieldValue && Array.isArray(fieldValue.create)) {
          rows = fieldValue.create
        } else if (Array.isArray(fieldValue)) {
          rows = fieldValue
        }
      }

      const addRow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        handleChange(field, { create: [...rows, {}] })
      }

      const handleCellChange = (name: string, value: string, index: number) => {
        const newRows = [...rows]
        newRows[index][name] = value
        handleChange(field, { create: newRows })
      }

      return (
        <UI.container>
          {(label || addLabel) && (
            <UI.menu>
              {label && <UI.label label={label} />}
              {addLabel && <UI.addButton label={addLabel} onClick={addRow} />}
            </UI.menu>
          )}
          <UI.table>
            <UI.header>
              {columns.map((column) => (
                <UI.headerColumn key={column.field} label={column.label} />
              ))}
            </UI.header>
            <UI.rows>
              {rows.map((row, index) => (
                <UI.row key={index}>
                  {columns.map((column) => (
                    <UI.rowColumn
                      key={column.field}
                      name={column.field}
                      placeholder={column.placeholder}
                      value={row[column.field] ?? ''}
                      onChange={(e) => handleCellChange(e.target.name, e.target.value, index)}
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
