import type { Column } from '@domain/engine/page/component/application/Table'
import type { Title } from '../base/Title'
import type { Button } from '../base/Button'

export interface Table {
  source: string
  columns: Column[]
  title?: Title
  buttons?: Button[]
}

export interface TableComponent extends Table {
  component: 'Table'
}

export interface TableBlock extends TableComponent {
  ref: string
}

export interface TableBlockRef extends Partial<Table> {
  component: 'Table'
  blockRef: string
}
