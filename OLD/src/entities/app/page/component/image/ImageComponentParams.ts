import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ImageComponentParams extends BaseComponentParams {
  readonly type: 'image'
  readonly path: string
  readonly text: string
  readonly width?: string
  readonly height?: string
  readonly style?: {
    readonly image?: UIStyle
  }
}

export const ImageComponentParams: t.Type<ImageComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('image'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    width: t.string,
    height: t.string,
    style: t.partial({
      image: UIStyle,
    }),
  }),
])
