import type { Config as Filter } from '@domain/entities/Filter'

export interface Record {
  expect: 'Record'
  table: string
  find: Filter[]
}
