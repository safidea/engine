import * as t from 'io-ts'
import { BaseFilterParams } from '../base/BaseFilterParams'

export const IsAnyOfFilterParams = t.intersection([
  BaseFilterParams,
  t.type({
    operator: t.literal('is_any_of'),
    value: t.array(t.string),
  }),
])

export type IsAnyOfFilterParams = t.TypeOf<typeof IsAnyOfFilterParams>
