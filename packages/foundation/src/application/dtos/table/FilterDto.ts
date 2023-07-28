export interface FilterDto {
  field: string
  operator: 'is_any_of'
  value: string | number | boolean | string[] | number[] | boolean[]
}
