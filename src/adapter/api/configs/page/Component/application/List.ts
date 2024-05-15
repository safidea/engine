import type { Column } from '@domain/engine/page/component/application/List'
import type { Base } from '../base/Base'

export interface List extends Base {
  source: string
  columns: Column[]
  open: string
}

export interface ListComponent extends List {
  component: 'List'
}

export interface ListBlock extends ListComponent {
  ref: string
}

export interface ListBlockRef extends Partial<List> {
  component: 'List'
  blockRef: string
}
