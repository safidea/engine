export type DataType = {
  [key: string]: string | number | boolean | undefined
}

export type RowType = DataType & {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
}