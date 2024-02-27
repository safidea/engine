import type { Props } from '@domain/engine/page/component/application/Table'
import type { Props as ButtonProps } from '@domain/engine/page/component/base/Button'

export interface Table extends Omit<Props, 'rows' | 'addButton'> {
  component: 'Table'
  source: string
  addButton?: ButtonProps
}
