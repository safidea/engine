export interface FilterOptions {
  field: string
  operator: 'is_any_of' | 'is'
  value: string | string[]
}
