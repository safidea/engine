import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'

export interface CardComponentParams extends BaseComponentParams {
  type: 'card'
  components: ComponentParams[]
}

export const CardComponentParams: t.Type<CardComponentParams> = t.recursion(
  'CardComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('card'),
        components: t.array(ComponentParams),
      }),
    ])
)
