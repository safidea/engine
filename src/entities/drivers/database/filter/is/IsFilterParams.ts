import * as t from 'io-ts'
import { BaseFilterParams } from '../base/BaseFilterParams'

export const IsFilterParams = t.intersection([
  BaseFilterParams,
  t.type({
    operator: t.literal('is'),
    value: t.string,
  }),
])

export type IsFilterParams = t.TypeOf<typeof IsFilterParams>
