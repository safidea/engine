import type { Config } from '@domain/entities/Action/database/CreateRecord'

export interface CreateRecord extends Config {
  service: 'Database'
  action: 'CreateRecord'
}
