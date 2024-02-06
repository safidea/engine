import type { Spec } from './spec/Spec'
import type { Page } from './page/Page'
import type { Table } from './table/Table'

export type Feature = {
  name: string
  specs?: Spec[]
  pages?: Page[]
  tables?: Table[]
}

export type FeatureSchema = Feature
