import type { Get } from '@domain/entities/request/Get'
import type { Post } from '@domain/entities/request/Post'
import type { Response } from '@domain/entities/response'
import type { Params, Spi } from '@domain/services/Server'
import type { GetDto, PostDto } from './dtos/RequestDto'
import { RequestMapper } from './mappers/RequestMapper'

export interface Driver {
  params: Params
  start(): Promise<string>
  stop(): Promise<void>
  get(path: string, handler: (request: GetDto) => Promise<Response>): Promise<void>
  post(path: string, handler: (request: PostDto) => Promise<Response>): Promise<void>
  notFound(handler: (request: GetDto) => Promise<Response>): Promise<void>
}

export class ServerSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    await this.driver.get(path, async (getDto) => {
      const request = RequestMapper.toGetService(getDto)
      return handler(request)
    })
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    await this.driver.post(path, async (postDto) => {
      const request = RequestMapper.toPostService(postDto)
      return handler(request)
    })
  }

  notFound = async (handler: (request: Get) => Promise<Response>) => {
    await this.driver.notFound(async (getDto) => {
      const request = RequestMapper.toGetService(getDto)
      return handler(request)
    })
  }

  start = async () => {
    return this.driver.start()
  }

  stop = async () => {
    await this.driver.stop()
  }
}
