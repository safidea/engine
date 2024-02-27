import type { Props } from '@domain/engine/page/component/base/Button'

export interface Button extends Omit<Props, 'clientProps'> {
  component: 'Button'
}
