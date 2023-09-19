import * as t from 'io-ts'
import { FilterParams } from '@entities/services/database/filter/FilterParams'

export const RecordCreatedTriggerParams = t.intersection([
  t.type({
    event: t.literal('record_created'),
    table: t.string,
  }),
  t.partial({
    filters: t.array(FilterParams),
  }),
])

export type RecordCreatedTriggerParams = t.TypeOf<typeof RecordCreatedTriggerParams>
