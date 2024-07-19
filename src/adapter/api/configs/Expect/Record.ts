import type { Filter } from '../Filter'

export interface Record {
  expect: 'Record'
  table: string
  find: Filter[]
}
