import type { Base } from './base'

export interface WebhookResponse extends Base {
  action: 'WebhookResponse'
  body: { [key: string]: string | number | boolean }
}
