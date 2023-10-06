import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const LinkComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('link'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    display: t.literal('primary-button'),
    style: t.partial({
      link: UIStyle,
    }),
  }),
])

export type LinkComponentParams = t.TypeOf<typeof LinkComponentParams>
