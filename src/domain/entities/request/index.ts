import type { Get } from './Get'
import type { Post } from './Post'
import type { Patch } from './Patch'

export type Request = Get | Post | Patch

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
