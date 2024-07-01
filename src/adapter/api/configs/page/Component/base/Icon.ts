import type { Type } from '@domain/engine/page/component/base/Icon'
import type { Base } from './Base'

export interface Config extends Base {
  type: Type
}

export interface Icon extends Config {
  component: 'Icon'
}
