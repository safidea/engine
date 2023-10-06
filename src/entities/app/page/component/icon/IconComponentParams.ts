import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const IconSize = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type IconSize = t.TypeOf<typeof IconSize>

export const IconComponentParams = t.intersection([
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

export type IconComponentParams = t.TypeOf<typeof IconComponentParams>
