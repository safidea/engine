import type { Config } from '@domain/entities/Trigger/RecordCreated'

export interface RecordCreated extends Omit<Config, 'automation'> {
  event: 'RecordCreated'
}
