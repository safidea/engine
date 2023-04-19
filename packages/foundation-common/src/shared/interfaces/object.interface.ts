export type ObjectValueType = ObjectInterface | string | number | boolean | undefined

export interface ObjectInterface {
  [key: string]: ObjectValueType
}
