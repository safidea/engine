import type { Column } from '@domain/entities/Component/application/Table'
import type { Config as Title } from '../content/Title'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  source: string
  columns: Column[]
  title?: Title
  buttons?: Button[]
}

export interface Table extends Config {
  component: 'Table'
}
