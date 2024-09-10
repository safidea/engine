import type { Config } from '@domain/entities/Action/database/ReadRecord'

export interface ReadRecord extends Config {
  service: 'Database'
  action: 'ReadRecord'
}
