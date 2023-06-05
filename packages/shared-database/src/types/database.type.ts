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

export type DatabaseServiceFunctionType = (
  tableName: string,
  params: DatabaseParamsIdType & DatabaseParamsDataType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionListType = (tableName: string) => Promise<DatabaseRowType[]>

export type DatabaseServiceFunctionIdType = (
  tableName: string,
  params: DatabaseParamsIdType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionDataType = (
  tableName: string,
  params: DatabaseParamsDataType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionReadType = (
  tableName: string,
  params: DatabaseParamsIdType
) => Promise<DatabaseRowType | null>
