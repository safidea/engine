import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const IconComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('icon'),
    name: t.string,
  }),
  t.partial({
    size: t.number,
    style: t.partial({
      icon: UIStyle,
    }),
  }),
])

export type IconComponentParams = t.TypeOf<typeof IconComponentParams>
