import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const ImageComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('image'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    width: t.string,
    style: t.partial({
      image: UIStyle,
    }),
  }),
])

export type ImageComponentParams = t.TypeOf<typeof ImageComponentParams>
