import type { Props } from '@domain/engine/page/component/Customized'

export interface Customized {
  customRef: string
  props?: Props
}

export interface CustomizedComponent extends Customized {
  component: 'Customized'
}

export interface CustomizedBlock extends CustomizedComponent {
  ref: string
}

export interface CustomizedBlockRef extends Partial<Customized> {
  component: 'Customized'
  blockRef: string
}
