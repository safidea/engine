import type { Align, Size } from '@domain/engine/page/component/base/base'
import type { Base } from '../base/Base'

export interface Config extends Base {
  text: string
  align?: Align
  size?: Size
}

export interface Paragraph extends Config {
  component: 'Paragraph'
}
