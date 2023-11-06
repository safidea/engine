import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type IconSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

export const IconSize: t.Type<IconSize> = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export interface IconComponentParams extends BaseComponentParams {
  readonly type: 'icon'
  readonly name: string
  readonly size?: IconSize
  readonly style?: {
    readonly icon?: UIStyle
  }
}

export const IconComponentParams: t.Type<IconComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('icon'),
    name: t.string,
  }),
  t.partial({
    size: IconSize,
    style: t.partial({
      icon: UIStyle,
    }),
  }),
])
