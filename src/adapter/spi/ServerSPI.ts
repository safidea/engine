import type { Get } from '@domain/services/request/Get'
import type { Post } from '@domain/services/request/Post'
import type { Response } from '@domain/services/response'
import type { ServerSpi as IServerSpi } from '@domain/services/Server'
import type { GetDto, PostDto } from './dtos/RequestDto'
import { RequestMapper } from './mappers/RequestMapper'
import type { ResponseDto } from './dtos/ResponseDto'

export interface ServerDriver {
  start(): Promise<string>
  stop(): Promise<void>
  get(path: string, handler: (request: GetDto) => Promise<ResponseDto>): Promise<void>
  post(path: string, handler: (request: PostDto) => Promise<ResponseDto>): Promise<void>
  notFound(handler: (request: GetDto) => Promise<ResponseDto>): Promise<void>
}

export class ServerSpi implements IServerSpi {
  constructor(private driver: ServerDriver) {}

  get = async (path: string, handler: (request: Get) => Promise<Response>) => {
    await this.driver.get(path, async (getDto) => {
      const request = RequestMapper.toGetService(getDto)
      const response = await handler(request)
      return response
    })
  }

  post = async (path: string, handler: (request: Post) => Promise<Response>) => {
    await this.driver.post(path, async (postDto) => {
      const request = RequestMapper.toPostService(postDto)
      const response = await handler(request)
      return response
    })
  }

  notFound = async (handler: (request: Get) => Promise<Response>) => {
    await this.driver.notFound(async (getDto) => {
      const request = RequestMapper.toGetService(getDto)
      const response = await handler(request)
      return response
    })
  }

  start = async () => {
    return this.driver.start()
  }

  stop = async () => {
    await this.driver.stop()
  }
}
