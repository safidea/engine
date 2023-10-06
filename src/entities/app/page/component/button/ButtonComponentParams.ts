import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const ButtonDisplay = t.union([t.literal('primary'), t.literal('secondary')])

export type ButtonDisplay = t.TypeOf<typeof ButtonDisplay>

export const ButtonSize = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type ButtonSize = t.TypeOf<typeof ButtonSize>

export const ButtonComponentParams = t.intersection([
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

export type ButtonComponentParams = t.TypeOf<typeof ButtonComponentParams>
