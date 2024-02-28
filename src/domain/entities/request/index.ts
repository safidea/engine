import type { Get } from './Get'
import type { Post } from './Post'

export type Request = Get | Post

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
