import type { Align, RoundedSize, Size } from '@domain/engine/page/component/base/base'
import type { Base } from './Base'

export interface Image extends Base {
  src: string
  alt: string
  size?: Size
  rounded?: RoundedSize
  align?: Align
}

export interface ImageComponent extends Image {
  component: 'Image'
}

export interface ImageBlock extends ImageComponent {
  ref: string
}

export interface ImageBlockRef extends Partial<Image> {
  component: 'Image'
  blockRef: string
}
