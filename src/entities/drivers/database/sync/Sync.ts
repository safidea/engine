import { Filter } from '../filter/Filter'
import { Record } from '../record/Record'

export interface SyncCommand {
  type: 'create' | 'update' | 'delete'
  table: string
  record: Record
}

export interface SyncResource {
  table: string
  filters?: Filter[]
}

export interface SyncTables {
  [key: string]: Record[] | undefined
}

export interface Sync {
  commands?: SyncCommand[]
  resources?: SyncResource[]
}
