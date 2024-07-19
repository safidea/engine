import type { Column } from '@domain/entities/Component/application/List'
import type { Base } from '../base/Base'

export interface Config extends Base {
  source: string
  columns: Column[]
  open: string
}

export interface List extends Config {
  component: 'List'
}
