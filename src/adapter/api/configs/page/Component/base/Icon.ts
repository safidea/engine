import type { Type } from '@domain/engine/page/component/base/Icon'
import type { Base } from './Base'

export interface Icon extends Base {
  type: Type
}

export interface IconComponent extends Icon {
  component: 'Icon'
}

export interface IconBlock extends IconComponent {
  ref: string
}

export interface IconBlockRef extends Partial<Icon> {
  component: 'Icon'
  blockRef: string
}
