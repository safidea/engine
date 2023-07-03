//TODO : remplacer par Record<Keys, Type> (https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype)

export type ObjectValueInterface = any

export interface ObjectInterface {
  [key: string]: ObjectValueInterface
}
