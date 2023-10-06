import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const ButtonComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('button'),
    text: t.string,
  }),
  t.partial({
    style: t.partial({
      button: UIStyle,
    }),
  }),
])

export type ButtonComponentParams = t.TypeOf<typeof ButtonComponentParams>
