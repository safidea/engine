export type ObjectValueInterface =
  | ObjectInterface
  | ObjectInterface[]
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined

export interface ObjectInterface {
  [key: string]: ObjectValueInterface
}
