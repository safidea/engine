import { FilterOptions } from '@entities/drivers/database/filter/FilterOptions'

export interface RecordUpdatedTriggerOptions {
  event: 'record_updated'
  table: string
  fields?: string[]
  filters?: FilterOptions[]
}
