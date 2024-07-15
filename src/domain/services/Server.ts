import type { Logger } from './Logger'
import type { Get } from '../entities/request/Get'
import type { Post } from '../entities/request/Post'
import type { Response } from '../entities/response'
import { Json } from '../entities/response/Json'
import type { Patch } from '@domain/entities/request/Patch'
import type { Delete } from '@domain/entities/request/Delete'

export interface Config {
  port?: string
  sslCert?: string
  sslKey?: string
  env?: string
}

export interface Params extends Config {
  logger: Logger
}

export interface Spi {
  params: Params
  baseUrl?: string
  start: () => Promise<string>
  stop: () => Promise<void>
  get: (path: string, handler: (request: Get) => Promise<Response>) => Promise<void>
  post: (path: string, handler: (request: Post) => Promise<Response>) => Promise<void>
  patch: (path: string, handler: (request: Patch) => Promise<Response>) => Promise<void>
  delete: (path: string, handler: (request: Delete) => Promise<Response>) => Promise<void>
  notFound: (handler: (request: Get) => Promise<Response>) => Promise<void>
}

export class Server {
  isListening: boolean = false
  isShuttingDown: boolean = false
  getHandlers: string[] = []
  postHandlers: string[] = []
  notFoundHandler?: () => Promise<void>

  constructor(private spi: Spi) {}

  get baseUrl() {
    return this.spi.baseUrl
  }

  get env() {
    return this.spi.params.env || 'development'
  }

  init = async (callback: () => Promise<void>) => {
    await this.get('/health', async () => new Json({ success: true }))
    await callback()
    if (this.notFoundHandler) await this.notFoundHandler()
  }

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    const { logger } = this.spi.params
    await this.spi.get(path, async (request: Get) => {
      logger.log(`GET ${path}`)
      return handler(request)
    })
    this.getHandlers.push(path)
    logger.log(`add GET handler ${path}`)
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    const { logger } = this.spi.params
    await this.spi.post(path, async (request: Post) => {
      logger.log(`POST ${path} ${JSON.stringify(request.body, null, 2)}`)
      return handler(request)
    })
    this.postHandlers.push(path)
    logger.log(`add POST handler ${path}`)
  }

  patch = async (path: string, handler: (request: Patch) => Promise<Response>) => {
    const { logger } = this.spi.params
    await this.spi.patch(path, async (request: Patch) => {
      logger.log(`PATCH ${path} ${JSON.stringify(request.body, null, 2)}`)
      return handler(request)
    })
    logger.log(`add PATCH handler ${path}`)
  }

  delete = async (path: string, handler: (request: Delete) => Promise<Response>) => {
    const { logger } = this.spi.params
    await this.spi.delete(path, async (request: Delete) => {
      logger.log(`DELETE ${path}`)
      return handler(request)
    })
    logger.log(`add DELETE handler ${path}`)
  }

  notFound = async (handler: (request: Get) => Promise<Response>) => {
    this.notFoundHandler = async () => {
      const { logger } = this.spi.params
      await this.spi.notFound(async (request: Get) => {
        logger.log(`404 ${request.path}`)
        return handler(request)
      })
      logger.log(`add 404 handler`)
    }
  }

  start = async () => {
    const { params, start } = this.spi
    const { logger } = params
    logger.log(`starting server...`)
    const url = await start()
    this.isListening = true
    logger.log(`server listening at ${url}`)
    return url
  }

  stop = async (callback: () => Promise<void>) => {
    const { params, stop } = this.spi
    const { logger } = params
    logger.log(`closing server...`)
    this.isShuttingDown = true
    await callback()
    this.isListening = false
    await stop()
    this.isShuttingDown = false
    logger.log('server closed')
  }

  hasGetHandler = (path: string) => {
    return this.getHandlers.includes(path)
  }

  hasPostHandler = (path: string) => {
    return this.postHandlers.includes(path)
  }
}
