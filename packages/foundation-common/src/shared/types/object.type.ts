import { ObjectInterface } from '../interfaces/object.interface'

export type ObjectValueType =
  | ObjectInterface
  | ObjectInterface[]
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined
