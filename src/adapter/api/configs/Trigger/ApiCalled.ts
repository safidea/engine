import type { Config } from '@domain/entities/Trigger/ApiCalled'

export interface ApiCalled extends Omit<Config, 'automation'> {
  event: 'ApiCalled'
}
