import type { Name } from '@domain/libraries/Icon'
import type { Base } from '../base/Base'

export interface Config extends Base {
  name: Name
}

export interface Icon extends Config {
  component: 'Icon'
}
