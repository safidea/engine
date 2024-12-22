import type { WebhookCalledHttpTriggerConfig } from '@domain/entities/Trigger/http/WebhookCalled'

export interface IWebhookCalledHttpTrigger
  extends Omit<WebhookCalledHttpTriggerConfig, 'automation'> {
  service: 'Http'
  event: 'WebhookCalled'
}
