import type { IServerMapper } from '../../mappers/IServerMapper'
import type { ServerPostRequest } from './request/ServerPostRequest'
import type { ServerResponse } from './response'

export class Server {
  constructor(private mapper: IServerMapper) {}

  post = async (path: string, handler: (request: ServerPostRequest) => Promise<ServerResponse>) => {
    this.mapper.post(path, handler)
  }
}
