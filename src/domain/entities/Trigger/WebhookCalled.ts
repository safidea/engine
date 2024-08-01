import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'

interface Config {
  automation: string
  path: string
}

interface Services {
  server: Server
  queue: Queue
}

export class WebhookCalled {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  get path() {
    const { path } = this._config
    return `/api/automation/${path}`
  }

  init = async () => {
    const { server } = this._services
    await server.post(this.path, this.post)
  }

  post = async (request: Post) => {
    const { queue } = this._services
    const { automation } = this._config
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
