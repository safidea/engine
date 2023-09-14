import { FilterOptions } from '@entities/drivers/database/filter/FilterOptions'

export interface RecordCreatedTriggerOptions {
  event: 'record_created'
  table: string
  filters?: FilterOptions[]
}
