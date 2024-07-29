import type { Get } from '@domain/entities/Request/Get'
import type { Post } from '@domain/entities/Request/Post'
import type { Response } from '@domain/entities/Response'
import type { Spi } from '@domain/services/Server'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from './dtos/RequestDto'
import { RequestMapper } from './mappers/RequestMapper'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Delete } from '@domain/entities/Request/Delete'
import type { Request } from '@domain/entities/Request'

export interface Driver {
  baseUrl?: string
  start(): Promise<string>
  stop(): Promise<void>
  get(path: string, handler: (request: GetDto) => Promise<Response>): Promise<void>
  post(path: string, handler: (request: PostDto) => Promise<Response>): Promise<void>
  patch(path: string, handler: (request: PatchDto) => Promise<Response>): Promise<void>
  delete(path: string, handler: (request: DeleteDto) => Promise<Response>): Promise<void>
  notFound(handler: (request: RequestDto) => Promise<Response>): Promise<void>
}

export class ServerSpi implements Spi {
  constructor(private driver: Driver) {}

  get baseUrl() {
    return this.driver.baseUrl
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

  patch = async (path: string, handler: (request: Patch) => Promise<Response>) => {
    await this.driver.patch(path, async (patchDto) => {
      const request = RequestMapper.toPatchService(patchDto)
      return handler(request)
    })
  }

  delete = async (path: string, handler: (request: Delete) => Promise<Response>) => {
    await this.driver.delete(path, async (deleteDto) => {
      const request = RequestMapper.toDeleteService(deleteDto)
      return handler(request)
    })
  }

  notFound = async (handler: (request: Request) => Promise<Response>) => {
    await this.driver.notFound(async (requestDto) => {
      const request = RequestMapper.toService(requestDto)
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
