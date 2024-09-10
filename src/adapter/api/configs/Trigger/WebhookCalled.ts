import type { Config } from '@domain/entities/Trigger/WebhookCalled'

export interface WebhookCalled extends Omit<Config, 'automation'> {
  event: 'WebhookCalled'
}
