import type { Spec } from './spec/Spec'
import type { Page } from './page/Page'
import type { Table } from './table/Table'
import type { Automation } from './automation/Automation'
import type { Config as Auth } from '@domain/services/Auth'

export type Feature = {
  name: string
  specs?: Spec[]
  pages?: Page[]
  tables?: Table[]
  automations?: Automation[]
  auth?: Auth
}

export type FeatureSchema = Feature
