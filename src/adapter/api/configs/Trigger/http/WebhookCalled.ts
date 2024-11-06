import type { Config } from '@domain/entities/Trigger/http/WebhookCalled'

export interface WebhookCalled extends Omit<Config, 'automation'> {
  service: 'Http'
  event: 'WebhookCalled'
}
