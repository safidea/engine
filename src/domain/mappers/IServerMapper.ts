import type { ServerPostRequest } from '../services/server/request/ServerPostRequest'
import type { ServerResponse } from '../services/server/response'

export interface IServerMapper {
  post: (path: string, handler: (request: ServerPostRequest) => Promise<ServerResponse>) => void
}
