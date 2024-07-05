import type { IconName } from '@domain/libraries/Icon'
import type { Base } from '../base/Base'

export interface Config extends Base {
  name: IconName
}

export interface Icon extends Config {
  component: 'Icon'
}
