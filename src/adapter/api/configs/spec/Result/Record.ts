import type { Filter } from '../../filter'

export interface Record {
  table: string
  find: Filter[]
}
