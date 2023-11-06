import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface CardComponentParams extends BaseComponentParams {
  readonly type: 'card'
  readonly components: ComponentParams[]
  readonly style?: {
    readonly card?: UIStyle
  }
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
      t.partial({
        style: t.partial({
          card: UIStyle,
        }),
      }),
    ])
)
