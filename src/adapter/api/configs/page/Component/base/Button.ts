import type { Type, Variant } from '@domain/engine/page/component/base/Button'

export interface Button {
  label: string
  href?: string
  type?: Type
  variant?: Variant
}

export interface ButtonComponent extends Button {
  component: 'Button'
}

export interface ButtonBlock extends ButtonComponent {
  ref: string
}

export interface ButtonBlockRef extends Partial<Button> {
  component: 'Button'
  blockRef: string
}
