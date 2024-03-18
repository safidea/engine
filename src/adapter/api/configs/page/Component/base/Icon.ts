import type { Type } from '@domain/engine/page/component/base/Icon'

export interface Icon {
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
