import type { Type } from '@domain/engine/page/component/base/Input'

export interface Input {
  name: string
  type?: Type
  placeholder?: string
  label?: string
  required?: boolean
}

export interface InputComponent extends Input {
  component: 'Input'
}

export interface InputBlock extends InputComponent {
  ref: string
}

export interface InputBlockRef extends Partial<Input> {
  component: 'Input'
  blockRef: string
}
