import * as t from 'io-ts'
import { AutomationParams } from './automation/AutomationParams'
import { PageParams } from './page/PageParams'
import { TableParams } from './table/TableParams'
import { BucketParams } from './bucket/BucketParams'

export type AppParams = {
  readonly name?: string
  readonly version?: string
  readonly pages?: PageParams[]
  readonly tables?: TableParams[]
  readonly automations?: AutomationParams[]
  readonly buckets?: BucketParams[]
}

export const AppParams: t.Type<AppParams> = t.partial({
  name: t.string,
  version: t.string,
  pages: t.array(PageParams),
  tables: t.array(TableParams),
  automations: t.array(AutomationParams),
  buckets: t.array(BucketParams),
})
