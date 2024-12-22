import type { IServerDriver } from '@adapter/spi/drivers/ServerSpi'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from '@adapter/spi/dtos/RequestDto'
import type { ServerConfig } from '@domain/services/Server'
import type { Response } from '@domain/entities/Response'
import { ExpressDriver } from './ExpressDriver'

export class ServerDriver implements IServerDriver {
  private _server: ExpressDriver

  constructor(config: ServerConfig) {
    this._server = new ExpressDriver(config)
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

  afterAllRoutes = async () => {
    await this._server.afterAllRoutes()
  }

  start = async (retry = 0): Promise<number> => {
    return this._server.start(retry)
  }

  stop = async () => {
    await this._server.stop()
  }
}
