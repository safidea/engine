import type { Type, Variant } from '@domain/entities/Component/base/Button'
import type { RequestMethod } from '@domain/entities/Request'
import type { Base } from './Base'

export interface Config extends Base {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  action?: string
  method?: RequestMethod
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

export interface Button extends Config {
  component: 'Button'
}
