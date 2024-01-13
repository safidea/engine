import * as t from 'io-ts'
import { BaseFilterParams } from '../base/BaseFilterParams'

export interface IsAnyOfFilterParams extends BaseFilterParams {
  readonly operator: 'is_any_of'
  readonly value: ReadonlyArray<string>
}

export const IsAnyOfFilterParams: t.Type<IsAnyOfFilterParams> = t.intersection([
  BaseFilterParams,
  t.type({
    operator: t.literal('is_any_of'),
    value: t.array(t.string),
  }),
])
