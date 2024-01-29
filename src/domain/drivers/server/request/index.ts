import { type ServerResponse } from '../response'
import { GetRequest } from './get'

import { PostRequest } from './post'

export type ServerRequest = GetRequest | PostRequest

export type IServerHandler = () => Promise<ServerResponse>
