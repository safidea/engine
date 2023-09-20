import { BucketList } from './bucket/BucketList'
import { TableList } from './table/TableList'

export interface AppConfig {
  readonly tables: TableList
  readonly buckets: BucketList
}
