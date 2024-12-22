import type { CreateRecordDatabaseActionConfig } from '@domain/entities/Action/database/CreateRecord'

export interface ICreateRecordDatabaseAction extends CreateRecordDatabaseActionConfig {
  service: 'Database'
  action: 'CreateRecord'
}
