import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import { Json } from '@domain/services/response/Json'

interface Params {
  automation: string
  path: string
  method: 'POST'
  server: Server
  queue: Queue
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
    const { automation, queue } = this.params
    const jobId = await queue.add(automation, {})
    return new Json({ success: true, id: jobId })
  }
}
