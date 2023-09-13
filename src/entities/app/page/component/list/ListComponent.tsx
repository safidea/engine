import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { Record } from '@entities/drivers/database/Record'
import { Column, GroupBy, ListComponentOptions, SortBy } from './ListComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { ComponentError } from '../ComponentError'
import { Table } from '@entities/app/table/Table'
import { GroupType, ListComponentUI } from './ListComponentUI'

export interface ColumnOption {
  name: string
  label: string
}

export interface ListComponentProps {
  records: Record[]
}

export class ListComponent extends BaseComponent {
  private readonly table: Table
  private readonly groupBy: GroupBy[]
  private readonly sortBy: SortBy[]
  private readonly columns: Column[]

  constructor(options: ListComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, table: tableName, groupBy, sortBy, columns } = options
    super({ type }, drivers, config)
    this.table = this.getTableByName(tableName)
    if (groupBy) {
      for (const group of groupBy) {
        if (!this.table.fields.find((field) => field.name === group.field))
          throw new ComponentError(
            type,
            `field ${group.field} in groupBy is not defined in table ${this.table.name}`
          )
      }
    }
    if (sortBy) {
      for (const sort of sortBy) {
        if (!this.table.fields.find((field) => field.name === sort.field))
          throw new ComponentError(
            type,
            `field ${sort.field} in sortBy is not defined in table ${this.table.name}`
          )
      }
    }
    if (columns) {
      for (const column of columns) {
        if (column.type === 'button') {
          if (!column.buttonLabel) {
            throw new ComponentError(
              type,
              `buttonLabel is not defined in button type column ${column.label} in table ${this.table.name}`
            )
          }
        }
        if (column.field) {
          const field = this.table.fields.find((field) => field.name === column.field)
          if (!field) {
            throw new ComponentError(
              type,
              `field "${column.field}" in columns is not defined in table ${this.table.name}`
            )
          }
          if (!column.type) {
            column.type = field.format ?? 'text'
          } else if (column.type === 'button') {
            if (field.type === 'url') {
              column.action = {
                type: 'open_url',
              }
            }
          }
        } else if (!column.type) {
          throw new ComponentError(
            type,
            `field or type is not defined in column ${column.label} in table ${this.table.name}`
          )
        }
      }
    }
    this.groupBy = groupBy ?? []
    this.sortBy = sortBy ?? []
    this.columns = columns ?? []
  }

  async render() {
    const useSyncRecords = this.drivers.fetcher.getSyncRecordsHook([{ table: this.table.name }])
    return () => {
      const { tables } = useSyncRecords()
      let records = tables[this.table.name] ?? []
      let groups: GroupType[] = []
      if (this.groupBy.length > 0) {
        groups = this.groupRecords(records)
      } else if (this.sortBy.length > 0) {
        records = this.sortRecords(records)
      }
      return (
        <ListComponentUI
          records={records}
          columns={this.columns}
          groups={groups}
          ui={this.drivers.ui}
          getCellByFormat={this.getCellByFormat}
        />
      )
    }
  }

  private sortRecords(records: Record[]): Record[] {
    return records.sort((a: Record, b: Record) => {
      for (let i = 0; i < this.sortBy.length; i++) {
        const field = this.sortBy[i].field
        const order = this.sortBy[i].order
        let aField = a.fields[field]
        let bField = b.fields[field]
        const fieldType = this.table.fields.find((c) => c.name === field)?.type
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

  private groupRecords(records: Record[]): GroupType[] {
    const groups: GroupType[] = []
    for (let i = 0; i < this.groupBy.length; i++) {
      const fieldName = this.groupBy[i].field
      const order = this.groupBy[i].order
      const column = this.columns.find((f) => f.field === fieldName)
      let options: ColumnOption[] = []
      if (column?.options) options = column.options
      if (order === 'last_to_first') options.reverse()
      for (let j = 0; j < options.length; j++) {
        const option = options[j]
        let groupedRecords = records.filter((record) => record.fields[fieldName] === option.name)
        if (this.sortBy && this.sortBy.length > 0) groupedRecords = this.sortRecords(records)
        groups.push({
          name: option.name,
          label: option.label,
          records: groupedRecords,
        })
      }
    }
    return groups
  }

  private getCellByFormat(column: Column, record: Record) {
    const { ButtonCell, CurrencyCell, TextCell } = this.drivers.ui.ListUI
    let value = column.field ? record.fields[column.field] : ''
    if (column.options) {
      value = column.options.find((option) => option.name === value)?.label ?? value
    }
    switch (column.type) {
      case 'button':
        function triggerAction() {
          if (!column.action) throw new Error('action is not defined in button column')
          switch (column.action.type) {
            case 'redirect':
              const path = column.action.path
              if (!path) throw new Error('path is not defined in redirect action')
              window.location.href = path.replace(':id', record.id)
              break
            case 'open_url':
              window.open(column.action.url ?? String(value), '_blank')
              break
            default:
              throw new Error(`action type ${column.action.type} is not defined`)
          }
        }
        return <ButtonCell label={String(column.buttonLabel)} onClick={() => triggerAction()} />
      case 'currency':
        value = Math.round(Number(value ?? 0) * 100) / 100
        return <CurrencyCell value={value} currency={'€'} />
      default:
        value = String(value ?? '')
        return <TextCell value={value} />
    }
  }
}
