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
  format?: string
  actions?: {
    type: string
    path: string
  }[]
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
    if (!table) throw new Error(`Table ${this._table} not found`)
    this._fields = table.fields
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
    function Row({ record }: { record: Record }) {
      return (
        <UI.row>
          {columns.map((column: Column, index: number) => {
            let value = column.field ? record.fields[column.field] : ''
            if (column.options) {
              value = column.options.find((option) => option.name === value)?.label ?? value
            }
            return <UI.rowColumn value={String(value)} key={index} />
          })}
        </UI.row>
      )
    }
    return function Component({ records }: ListProps) {
      let groups: GroupType[] = []
      if (groupBy.length > 0) {
        groups = groupRecords({ records, groupBy, fields, sortBy, columns, sortRecords })
      } else if (sortBy.length > 0) {
        records = sortRecords({ records, sortBy, fields })
      }
      return (
        <UI.container>
          <UI.header>
            {columns.map((column: Column, index: number) => (
              <UI.headerColumn label={column.label} key={index} />
            ))}
          </UI.header>
          <UI.rows>
            {groups.length > 0
              ? groups.map((group) => (
                  <Fragment key={group.name}>
                    <UI.group colSpan={columns.length} label={group.label} />
                    {group.records.map((record) => (
                      <Row key={record.id} record={record} />
                    ))}
                  </Fragment>
                ))
              : records.map((record: Record) => <Row key={record.id} record={record} />)}
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
