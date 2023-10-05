import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const ImageComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('image'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    width: t.string,
  }),
])

export type ImageComponentParams = t.TypeOf<typeof ImageComponentParams>
