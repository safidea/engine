import type { Data as PersistedData } from '@domain/entities/Record/Persisted'
import type { Data as ToCreateData } from '@domain/entities/Record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/Record/ToUpdate'

export type ToCreateDto = ToCreateData
export type ToUpdateDto = ToUpdateData
export type PersistedDto = PersistedData
