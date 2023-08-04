import React, { Fragment } from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'
import { Record } from '@domain/entities/table/Record'
import { Field } from '@domain/entities/table/Field'
import { Table } from '@domain/entities/table/Table'

export interface GroupBy {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export interface SortBy {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export interface SortProps {
  records: Record[]
  sortBy: SortBy[]
  fields: Field[]
}

export interface GroupType {
  name: string
  label: string
  records: Record[]
}

export interface GroupProps {
  records: Record[]
  groupBy: GroupBy[]
  sortBy: SortBy[]
  columns: Column[]
  fields: Field[]
  sortRecords: (props: SortProps) => Record[]
}

export interface ColumnOption {
  name: string
  label: string
}

export interface Column {
  label: string
  field?: string
  options?: ColumnOption[]
  type?: string
  action?: {
    type: string
    path?: string
  }
}

export interface ListProps {
  records: Record[]
}

export class List extends BaseComponent {
  private readonly _fields: Field[] = []

  constructor(
    private readonly _table: string,
    private readonly _groupBy: GroupBy[] = [],
    private readonly _sortBy: SortBy[] = [],
    private readonly _columns: Column[] = [],
    private readonly _ui: IUIGateway['ListUI'],
    private readonly _tables: Table[] = []
  ) {
    super('link')
    const table = this._tables.find((table) => this._table === table.name)
    if (!table) throw new Error(`table ${this._table} is not defined in tables`)
    this._fields = table.fields
    if (this._groupBy.length > 0) {
      for (const groupBy of this._groupBy) {
        if (!this._fields.find((field) => field.name === groupBy.field))
          throw new Error(
            `field ${groupBy.field} in groupBy is not defined in table ${this._table}`
          )
      }
    }
    if (this._sortBy.length > 0) {
      for (const sortBy of this._sortBy) {
        if (!this._fields.find((field) => field.name === sortBy.field))
          throw new Error(`field ${sortBy.field} in sortBy is not defined in table ${this._table}`)
      }
    }
  }

  get table(): string {
    return this._table
  }

  get groupBy(): GroupBy[] {
    return this._groupBy
  }

  get sortBy(): SortBy[] {
    return this._sortBy
  }

  get columns(): Column[] {
    return this._columns
  }

  get buttons(): Column[] {
    return this._columns.filter((column) => column.type === 'button')
  }

  get fields(): Field[] {
    return this._fields
  }

  renderUI() {
    const UI = this._ui
    const columns = this._columns
    const groupBy = this.groupBy
    const sortBy = this.sortBy
    const fields = this.fields
    const groupRecords = this.groupRecords
    const sortRecords = this.sortRecords
    function ListRowUI({ record }: { record: Record }) {
      return (
        <UI.row id={record.id}>
          {columns.map((column: Column, index: number) => {
            let value = column.field ? record.fields[column.field] : ''
            if (column.options) {
              value = column.options.find((option) => option.name === value)?.label ?? value
            }
            function getCellByFormat() {
              switch (column.type) {
                case 'button':
                  function triggerAction() {
                    if (!column.action) throw new Error('action is not defined')
                    switch (column.action.type) {
                      case 'redirect':
                        if (!column.action.path)
                          throw new Error('path is not defined inredirect  action')
                        const path = column.action.path.replace(':id', record.id)
                        window.location.href = path
                        break
                      default:
                        throw new Error(`action type ${column.action.type} is not defined`)
                    }
                  }
                  return <UI.buttonCell label={column.label} onClick={() => triggerAction()} />
                default:
                  return <UI.textCell value={String(value)} />
              }
            }
            return <UI.cell key={index}>{getCellByFormat()}</UI.cell>
          })}
        </UI.row>
      )
    }
    return function ListUI({ records }: ListProps) {
      let groups: GroupType[] = []
      if (groupBy.length > 0) {
        groups = groupRecords({ records, groupBy, fields, sortBy, columns, sortRecords })
      } else if (sortBy.length > 0) {
        records = sortRecords({ records, sortBy, fields })
      }
      return (
        <UI.container>
          <UI.header>
            {columns.map((column: Column, index: number) => {
              if (column.type === 'button') return undefined
              return <UI.headerColumn label={column.label} key={index} />
            })}
          </UI.header>
          <UI.rows>
            {groups.length > 0
              ? groups.map((group) => (
                  <Fragment key={group.name}>
                    <UI.group colSpan={columns.length} label={group.label} />
                    {group.records.map((record) => (
                      <ListRowUI key={record.id} record={record} />
                    ))}
                  </Fragment>
                ))
              : records.map((record: Record) => <ListRowUI key={record.id} record={record} />)}
          </UI.rows>
        </UI.container>
      )
    }
  }

  sortRecords({ records, sortBy, fields }: SortProps): Record[] {
    return records.sort((a: Record, b: Record) => {
      for (let i = 0; i < sortBy.length; i++) {
        const field = sortBy[i].field
        const order = sortBy[i].order
        let aField = a.fields[field]
        let bField = b.fields[field]
        const fieldType = fields.find((c) => c.name === field)?.type
        if (fieldType === 'DateTime' && aField && bField) {
          aField = Date.parse(String(aField))
          bField = Date.parse(String(bField))
        }
        if (aField && bField) {
          if (aField > bField) {
            return order === 'desc' ? -1 : 1
          } else if (aField < bField) {
            return order === 'desc' ? 1 : -1
          }
        }
      }
      return 0
    })
  }

  groupRecords({
    records,
    groupBy,
    sortBy,
    columns,
    fields,
    sortRecords,
  }: GroupProps): GroupType[] {
    const groups: GroupType[] = []
    for (let i = 0; i < groupBy.length; i++) {
      const fieldName = groupBy[i].field
      const order = groupBy[i].order
      const column = columns.find((f) => f.field === fieldName)
      let options: ColumnOption[] = []
      if (column?.options) options = column.options
      if (order === 'last_to_first') options.reverse()
      for (let j = 0; j < options.length; j++) {
        const option = options[j]
        let groupedRecords = records.filter((record) => record.fields[fieldName] === option.name)
        if (sortBy && sortBy.length > 0)
          groupedRecords = sortRecords({ records: groupedRecords, sortBy, fields })
        groups.push({
          name: option.name,
          label: option.label,
          records: groupedRecords,
        })
      }
    }
    return groups
  }
}
