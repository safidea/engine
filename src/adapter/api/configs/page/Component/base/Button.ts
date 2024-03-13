import type { Type, Variant } from '@domain/engine/page/component/base/Button'
import type { Method } from '@domain/entities/request'

export interface Button {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  action?: string
  method?: Method
  onSuccess?:
    | {
        redirect: string
      }
    | {
        notification: {
          message: string
          type: 'success' | 'error'
        }
      }
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
