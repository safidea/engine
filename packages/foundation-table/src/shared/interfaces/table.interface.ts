import type { ObjectInterface } from 'foundation-common'
import type {
  PrismaModelFieldInterface,
  PrismaModelFieldsInterface,
  PrismaModelInterface,
} from 'foundation-database'

export type TableFieldInterface = PrismaModelFieldInterface

export type TableFieldsInterface = PrismaModelFieldsInterface

export interface TableInterface extends ObjectInterface, Omit<PrismaModelInterface, 'map'> {
  model?: string
  base: string
}

export interface TablesInterface extends ObjectInterface {
  [key: string]: TableInterface
}
