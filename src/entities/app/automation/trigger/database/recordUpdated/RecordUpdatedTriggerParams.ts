import * as t from 'io-ts'
import { FilterParams } from '@entities/services/database/filter/FilterParams'

export const RecordUpdatedTriggerParams = t.type({
  event: t.literal('record_updated'),
  table: t.string,
  fields: t.array(t.string),
  filters: t.array(FilterParams),
})

export type RecordUpdatedTriggerParams = t.TypeOf<typeof RecordUpdatedTriggerParams>
