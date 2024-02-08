import type { Server } from '@domain/services/Server'
import { Json } from '@domain/services/response/Json'

interface Params {
  path: string
  method: 'POST'
  server: Server
}
export class WebhookCalled {
  constructor(private params: Params) {
    const { server, method } = params
    if (method === 'POST') {
      server.post(this.path, this.post)
    }
  }

  get path() {
    const { path } = this.params
    return `/api/automation/${path}`
  }

  post = async () => {
    return new Json({ success: true, id: 1 })
  }
}
