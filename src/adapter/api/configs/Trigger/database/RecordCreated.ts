import type { Config } from '@domain/entities/Trigger/database/RecordCreated'

export interface RecordCreated extends Omit<Config, 'automation'> {
  service: 'Database'
  event: 'RecordCreated'
}
