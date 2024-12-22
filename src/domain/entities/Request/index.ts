import type { GetRequest } from './Get'
import type { PostRequest } from './Post'
import type { PatchRequest } from './Patch'
import type { DeleteRequest } from './Delete'

export type Request = GetRequest | PostRequest | PatchRequest | DeleteRequest

export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'
