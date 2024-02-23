import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type ButtonDisplay = 'primary' | 'secondary'

export const ButtonDisplay: t.Type<ButtonDisplay> = t.union([
  t.literal('primary'),
  t.literal('secondary'),
])

export type ButtonSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

export const ButtonSize: t.Type<ButtonSize> = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export interface ButtonComponentParams extends BaseComponentParams {
  readonly type: 'button'
  readonly text: string
  readonly size?: ButtonSize
  readonly display?: ButtonDisplay
  readonly style?: {
    readonly button?: UIStyle
  }
}

export const ButtonComponentParams: t.Type<ButtonComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('button'),
    text: t.string,
  }),
  t.partial({
    size: ButtonSize,
    display: ButtonDisplay,
    style: t.partial({
      button: UIStyle,
    }),
  }),
])
