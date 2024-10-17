import type { Test } from './Test'
import type { Page } from './Page'
import type { Table } from './Table'
import type { Automation } from './Automation'
import type { Services } from './Services'
import type { Bucket } from './Bucket'

export interface Config extends Services {
  name: string
  tests?: Test[]
  pages?: Page[]
  tables?: Table[]
  buckets?: Bucket[]
  automations?: Automation[]
}

export type AppSchema = Config
