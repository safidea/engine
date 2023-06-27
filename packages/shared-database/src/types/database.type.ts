export type DatabaseDataType = {
  [key: string]: string | number | boolean
}

export type DatabaseRowType = DatabaseDataType & {
  id: string | number
  created_at: string
  updated_at?: string
  deleted_at?: string
}

export type DatabaseParamsIdType = {
  id: string | number
}

export type DatabaseParamsDataType = {
  data: DatabaseDataType
}

export type DatabaseListParamsFiltersInterface = {
  key: string
  operator: string
  value: string
}

export type DatabaseListParamsInterface = {
  filters?: DatabaseListParamsFiltersInterface[]
}
