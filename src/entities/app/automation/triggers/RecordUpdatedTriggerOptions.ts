import { FilterOptions } from "@entities/drivers/database/FilterOptions"

export interface RecordUpdatedTriggerOptions {
  event: 'record_updated'
  table: string
  fields?: string[]
  filters?: FilterOptions[]
}
