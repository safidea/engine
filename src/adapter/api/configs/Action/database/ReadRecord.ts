import type { ReadRecordDatabaseActionConfig } from '@domain/entities/Action/database/ReadRecord'

export interface IReadRecordDatabaseAction extends ReadRecordDatabaseActionConfig {
  service: 'Database'
  action: 'ReadRecord'
}
