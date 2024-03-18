import type { Get } from './Get'
import type { Post } from './Post'
import type { Patch } from './Patch'
import type { Delete } from './Delete'

export type Request = Get | Post | Patch | Delete

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'
