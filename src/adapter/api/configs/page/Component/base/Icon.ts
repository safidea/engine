import type { Name } from '@domain/engine/page/component/base/Icon'
import type { Base } from './Base'

export interface Config extends Base {
  name: Name
}

export interface Icon extends Config {
  component: 'Icon'
}
