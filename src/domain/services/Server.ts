import type { Logger } from './Logger'
import type { Get } from '../entities/Request/Get'
import type { Post } from '../entities/Request/Post'
import type { Response } from '../entities/Response'
import { Json } from '../entities/Response/Json'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Delete } from '@domain/entities/Request/Delete'
import type { Request } from '@domain/entities/Request'

export interface Config {
  port?: string
  sslCert?: string
  sslKey?: string
  env?: string
}

export interface Services {
  logger: Logger
}

export interface Spi {
  baseUrl?: string
  start: () => Promise<string>
  stop: () => Promise<void>
  get: (path: string, handler: (request: Get) => Promise<Response>) => Promise<void>
  post: (path: string, handler: (request: Post) => Promise<Response>) => Promise<void>
  patch: (path: string, handler: (request: Patch) => Promise<Response>) => Promise<void>
  delete: (path: string, handler: (request: Delete) => Promise<Response>) => Promise<void>
  notFound: (handler: (request: Request) => Promise<Response>) => Promise<void>
}

export class Server {
  private log: (message: string) => void
  isListening: boolean = false
  isShuttingDown: boolean = false
  getHandlers: string[] = []
  postHandlers: string[] = []
  notFoundHandler?: () => Promise<void>

  constructor(
    private spi: Spi,
    services: Services,
    private config: Config
  ) {
    this.log = services.logger.init('server')
  }

  get baseUrl() {
    return this.spi.baseUrl
  }

  get env() {
    return this.config.env
  }

  init = async (callback: () => Promise<void>) => {
    await this.get('/health', async () => new Json({ success: true }))
    await callback()
    if (this.notFoundHandler) await this.notFoundHandler()
  }

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    await this.spi.get(path, async (request: Get) => {
      this.log(`GET ${path}`)
      return handler(request)
    })
    this.getHandlers.push(path)
    this.log(`add GET handler ${path}`)
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    await this.spi.post(path, async (request: Post) => {
      this.log(`POST ${path} ${JSON.stringify(request.body, null, 2)}`)
      return handler(request)
    })
    this.postHandlers.push(path)
    this.log(`add POST handler ${path}`)
  }

  patch = async (path: string, handler: (request: Patch) => Promise<Response>) => {
    await this.spi.patch(path, async (request: Patch) => {
      this.log(`PATCH ${path} ${JSON.stringify(request.body, null, 2)}`)
      return handler(request)
    })
    this.log(`add PATCH handler ${path}`)
  }

  delete = async (path: string, handler: (request: Delete) => Promise<Response>) => {
    await this.spi.delete(path, async (request: Delete) => {
      this.log(`DELETE ${path}`)
      return handler(request)
    })
    this.log(`add DELETE handler ${path}`)
  }

  notFound = async (pageHandler: (get: Get) => Promise<Response>) => {
    this.notFoundHandler = async () => {
      await this.spi.notFound(async (request: Request) => {
        this.log(`404 ${request.path}`)
        if (request.path.startsWith('/api/table/')) {
          const table = request.path.split('/').pop()
          return new Json({ error: `Table "${table}" not found` }, 404)
        }
        return pageHandler(request)
      })
      this.log(`add 404 handler`)
    }
  }

  start = async () => {
    const { start } = this.spi
    this.log(`starting server...`)
    const url = await start()
    this.isListening = true
    this.log(`server listening at ${url}`)
    return url
  }

  stop = async (callback: () => Promise<void>) => {
    this.log(`closing server...`)
    this.isShuttingDown = true
    this.isListening = false
    try {
      await callback()
    } catch (error) {
      if (error instanceof Error) this.log(`error stopping app: ${error.message}`)
    } finally {
      await this.spi.stop()
      this.isShuttingDown = false
      this.log('server closed')
    }
  }

  hasGetHandler = (path: string) => {
    return this.getHandlers.includes(path)
  }

  hasPostHandler = (path: string) => {
    return this.postHandlers.includes(path)
  }
}
