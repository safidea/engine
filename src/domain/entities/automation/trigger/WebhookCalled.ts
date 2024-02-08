interface Params {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
}
export class WebhookCalled {
  constructor(private params: Params) {}
}
