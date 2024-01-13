import * as t from 'io-ts'
import { FilterParams } from '@entities/services/database/filter/FilterParams'

export type RecordCreatedTriggerParams = {
  readonly event: 'record_created'
  readonly table: string
  readonly filters?: FilterParams[]
}

export const RecordCreatedTriggerParams: t.Type<RecordCreatedTriggerParams> = t.intersection([
  t.type({
    event: t.literal('record_created'),
    table: t.string,
  }),
  t.partial({
    filters: t.array(FilterParams),
  }),
])
