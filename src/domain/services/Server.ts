import type { Get } from './Request/Get'
import type { Post } from './Request/Post'
import type { Response } from './Response'

export interface ServerSPI {
  start: () => Promise<void>
  stop: () => Promise<void>
  get: (path: string, handler: (request: Get) => Promise<Response>) => Promise<void>
  post: (path: string, handler: (request: Post) => Promise<Response>) => Promise<void>
}

export class Server {
  constructor(private spi: ServerSPI) {}

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    await this.spi.get(path, handler)
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    await this.spi.post(path, handler)
  }

  start = async () => {
    await this.spi.start()
  }

  stop = async () => {
    await this.spi.stop()
  }
}
