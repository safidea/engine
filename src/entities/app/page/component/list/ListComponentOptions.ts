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
  type?: string
  action?: {
    type: string
    path?: string
    url?: string
  }
  buttonLabel?: string
}

export interface ListComponentOptions {
  type: 'list'
  table: string
  groupBy?: GroupBy[]
  sortBy?: SortBy[]
  columns: Column[]
}
