import * as t from 'io-ts'
import { FilterParams } from '@entities/services/database/filter/FilterParams'

export type RecordUpdatedTriggerParams = {
  readonly event: 'record_updated'
  readonly table: string
  readonly fields?: string[]
  readonly filters?: FilterParams[]
}

export const RecordUpdatedTriggerParams: t.Type<RecordUpdatedTriggerParams> = t.intersection([
  t.type({
    event: t.literal('record_updated'),
    table: t.string,
  }),
  t.partial({
    fields: t.array(t.string),
    filters: t.array(FilterParams),
  }),
])
