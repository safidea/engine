import type { Driver } from '@adapter/spi/ServerSpi'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from '@adapter/spi/dtos/RequestDto'
import type { Config } from '@domain/services/Server'
import type { Response } from '@domain/entities/Response'
import { ExpressDriver } from './ExpressDriver'

export class ServerDriver implements Driver {
  private _server: ExpressDriver

  constructor(config: Config) {
    this._server = new ExpressDriver(config)
  }

  get baseUrl() {
    return this._server.baseUrl
  }

  get = async (path: string, handler: (getDto: GetDto) => Promise<Response>) => {
    await this._server.get(path, handler)
  }

  post = async (path: string, handler: (postDto: PostDto) => Promise<Response>) => {
    await this._server.post(path, handler)
  }

  patch = async (path: string, handler: (patchDto: PatchDto) => Promise<Response>) => {
    await this._server.patch(path, handler)
  }

  delete = async (path: string, handler: (deleteDto: DeleteDto) => Promise<Response>) => {
    await this._server.delete(path, handler)
  }

  notFound = async (handler: (requestDto: RequestDto) => Promise<Response>) => {
    await this._server.notFound(handler)
  }

  start = async (retry = 0): Promise<string> => {
    return this._server.start(retry)
  }

  stop = async () => {
    await this._server.stop()
  }
}
