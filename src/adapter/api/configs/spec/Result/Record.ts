import type { Filter } from "../../filter"

export interface Record {
  table: string
  findOne: Filter[]
}
