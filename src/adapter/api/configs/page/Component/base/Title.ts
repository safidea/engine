import type { Align, Size } from '@domain/engine/page/component/base/base'
import type { Base } from './Base'

export interface Config extends Base {
  text: string
  align?: Align
  size?: Size
}

export interface Title extends Config {
  component: 'Title'
}
