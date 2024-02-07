import type { Logger } from './Logger'
import type { Get } from './request/Get'
import type { Post } from './request/Post'
import type { Response } from './response'
import { Json } from './response/Json'

export interface Params {
  port?: number
  logger: Logger
}

export interface Spi {
  params: Params
  start: () => Promise<string>
  stop: () => Promise<void>
  get: (path: string, handler: (request: Get) => Promise<Response>) => Promise<void>
  post: (path: string, handler: (request: Post) => Promise<Response>) => Promise<void>
  notFound: (handler: (request: Get) => Promise<Response>) => Promise<void>
}

export class Server {
  isListening: boolean = false
  isShuttingDown: boolean = false

  constructor(private spi: Spi) {
    this.get('/health', async () => new Json({ success: true }))
  }

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    const { params, get } = this.spi
    const { logger } = params
    await get(path, async (request: Get) => {
      logger.log(`GET ${path}`)
      return handler(request)
    })
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    const { params, post } = this.spi
    const { logger } = params
    await post(path, async (request: Post) => {
      logger.log(`POST ${path} ${JSON.stringify(request.body, null, 2)}`)
      return handler(request)
    })
  }

  notFound = async (handler: (request: Get) => Promise<Response>) => {
    const { params, notFound } = this.spi
    const { logger } = params
    await notFound(async (request: Get) => {
      logger.log(`404 ${request.path}`)
      return handler(request)
    })
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
}
