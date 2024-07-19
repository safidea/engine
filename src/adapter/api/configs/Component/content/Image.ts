import type { Align, RoundedSize, Size } from '@domain/entities/Component/base/base'
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
