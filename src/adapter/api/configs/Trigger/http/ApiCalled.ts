import type { Config } from '@domain/entities/Trigger/http/ApiCalled'

export interface ApiCalled extends Omit<Config, 'automation'> {
  service: 'Http'
  event: 'ApiCalled'
}
