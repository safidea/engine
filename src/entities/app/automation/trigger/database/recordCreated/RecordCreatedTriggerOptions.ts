import { FilterOptions } from "@entities/drivers/database/FilterOptions"

export interface RecordCreatedTriggerOptions {
  event: 'record_created'
  table: string
  filters?: FilterOptions[]
}