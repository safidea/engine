import * as t from 'io-ts'
import { FilterParams } from '@entities/drivers/database/filter/FilterParams'

export const RecordCreatedTriggerParams = t.type({
  event: t.literal('record_created'),
  table: t.string,
  filters: t.array(FilterParams),
})

export type RecordCreatedTriggerParams = t.TypeOf<typeof RecordCreatedTriggerParams>