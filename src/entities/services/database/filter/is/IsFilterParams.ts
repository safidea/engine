import * as t from 'io-ts'
import { BaseFilterParams } from '../base/BaseFilterParams'

export interface IsFilterParams extends BaseFilterParams {
  readonly operator: 'is'
  readonly value: string
}

export const IsFilterParams: t.Type<IsFilterParams> = t.intersection([
  BaseFilterParams,
  t.type({
    operator: t.literal('is'),
    value: t.string,
  }),
])
