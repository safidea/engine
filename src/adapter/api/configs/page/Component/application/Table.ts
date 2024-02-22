import type { Props } from '@domain/engine/page/component/application/Table'

export interface Table extends Omit<Props, 'rows'> {
  component: 'Table'
  source: string
}
