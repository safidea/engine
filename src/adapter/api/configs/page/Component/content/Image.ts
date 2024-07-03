import type { Align, RoundedSize, Size } from '@domain/engine/page/component/base/base'
import type { Base } from '../base/Base'

export interface Config extends Base {
  src: string
  alt: string
  size?: Size
  rounded?: RoundedSize
  align?: Align
}

export interface Image extends Config {
  component: 'Image'
}
