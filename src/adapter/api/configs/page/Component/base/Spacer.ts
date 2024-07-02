import type { Size } from '@domain/engine/page/component/base/base'
import type { Base } from './Base'

export interface Config extends Base {
  size?: Size
}

export interface Spacer extends Config {
  component: 'Spacer'
}
