import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'

interface Config {
  automation: string
  path: string
  method: 'POST'
}

interface Services {
  server: Server
  queue: Queue
}

export class WebhookCalled {
  constructor(
    private config: Config,
    private services: Services
  ) {}

  get path() {
    const { path } = this.config
    return `/api/automation/${path}`
  }

  init = async () => {
    const { server } = this.services
    const { method } = this.config
    if (method === 'POST') {
      await server.post(this.path, this.post)
    }
  }

  post = async (request: Post) => {
    const { queue } = this.services
    const { automation } = this.config
    const result = {
      path: request.path,
      baseUrl: request.baseUrl,
      body: request.body,
      headers: request.headers,
      query: request.query,
      params: request.params,
    }
    const jobId = await queue.add(automation, result)
    return new Json({ success: true, id: jobId })
  }
}
