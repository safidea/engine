import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'
import { Record } from '../../table/Record'

export interface GroupBy {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export interface SortBy {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export interface Column {
  label: string
  field?: string
  options?: {
    name: string
    label: string
  }[]
  format?: string
  actions?: {
    type: string
    path: string
  }[]
}

export interface ListProps {
  records: Record[]
  error: string | undefined
  isLoading: boolean
}

export class List extends BaseComponent {
  constructor(
    private readonly _table: string = '#',
    private readonly _groupBy: GroupBy[] = [],
    private readonly _sortBy: SortBy[] = [],
    private readonly _columns: Column[] = [],
    private readonly _ui: IUIGateway['ListUI']
  ) {
    super('link')
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

  renderUI() {
    const UI = this._ui
    const columns = this._columns
    return function Component({ records = [], error, isLoading }: ListProps) {
      if (error) return <UI.error />
      if (isLoading) return <UI.loading />
      return (
        <UI.container>
          <UI.header>
            {columns.map((column: Column, index: number) => (
              <UI.headerColumn label={column.label} key={index} />
            ))}
          </UI.header>
          <UI.rows>
            {records.map((record: Record) => (
              <UI.row key={record.id}>
                {columns.map((column: Column, index: number) => {
                  const value = column.field ? record.fields[column.field] : ''
                  return <UI.rowColumn value={String(value)} key={index} />
                })}
              </UI.row>
            ))}
          </UI.rows>
        </UI.container>
      )
    }
  }
}
