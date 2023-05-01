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
  baseName: string,
  tableName: string,
  params: DatabaseParamsIdType & DatabaseParamsDataType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionListType = (
  baseName: string,
  tableName: string
) => Promise<DatabaseRowType[]>

export type DatabaseServiceFunctionIdType = (
  baseName: string,
  tableName: string,
  params: DatabaseParamsIdType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionDataType = (
  baseName: string,
  tableName: string,
  params: DatabaseParamsDataType
) => Promise<DatabaseRowType>

export type DatabaseServiceFunctionReadType = (
  baseName: string,
  tableName: string,
  params: DatabaseParamsIdType
) => Promise<DatabaseRowType | null>
