import type { Size } from '@domain/entities/Component/base/base'
import type { Base } from '../base/Base'

export interface Config extends Base {
  size?: Size
}

export interface Spacer extends Config {
  component: 'Spacer'
}
