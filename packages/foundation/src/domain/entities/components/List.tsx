import { IUIRepository } from '@domain/repositories/IUIRepository'
import { BaseComponent } from './BaseComponent'
import { Record } from '../Record'

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
    private readonly _ui: IUIRepository['ListUI']
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
          <UI.header columns={columns} />
          <UI.rows>
            {records.map((record: Record) => (
              <UI.row key={record.id} record={record} columns={columns} />
            ))}
          </UI.rows>
        </UI.container>
      )
    }
  }
}
