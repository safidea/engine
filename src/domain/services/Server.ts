import type { Get } from './request/Get'
import type { Post } from './request/Post'
import type { Response } from './response'
import { Json } from './response/Json'

export interface ServerSpi {
  start: () => Promise<string>
  stop: () => Promise<void>
  get: (path: string, handler: (request: Get) => Promise<Response>) => Promise<void>
  post: (path: string, handler: (request: Post) => Promise<Response>) => Promise<void>
  notFound: (handler: (request: Get) => Promise<Response>) => Promise<void>
}

export class Server {
  isListening: boolean = false
  isShuttingDown: boolean = false

  constructor(private spi: ServerSpi) {
    this.get('/health', async () => new Json({ success: true }))
  }

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    await this.spi.get(path, handler)
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    await this.spi.post(path, handler)
  }

  notFound = async (handler: (request: Get) => Promise<Response>) => {
    await this.spi.notFound(handler)
  }

  start = async () => {
    return this.spi.start()
  }

  stop = async (callback: () => Promise<void>) => {
    this.isShuttingDown = true
    await callback()
    this.isListening = false
    await this.spi.stop()
    this.isShuttingDown = false
  }
}
