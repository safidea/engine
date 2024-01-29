import { type ServerResponse } from '../response'
import { BaseRequest } from './base'

export class GetRequest extends BaseRequest {
  constructor() {
    super()
  }
}

export type IServerGetHandler = () => Promise<ServerResponse>
