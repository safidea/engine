export interface WebhookCalled {
  event: 'WebhookCalled'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}
