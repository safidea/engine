import type { ApiCalledHttpTriggerConfig } from '@domain/entities/Trigger/http/ApiCalled'

export interface IApiCalledHttpTrigger extends Omit<ApiCalledHttpTriggerConfig, 'automation'> {
  service: 'Http'
  event: 'ApiCalled'
}
