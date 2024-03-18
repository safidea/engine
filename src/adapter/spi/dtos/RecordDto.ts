import type { Data as PersistedData } from '@domain/entities/record/Persisted'
import type { Data as ToCreateData } from '@domain/entities/record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/record/ToUpdate'

export type ToCreateDto = ToCreateData
export type ToUpdateDto = ToUpdateData
export type PersistedDto = PersistedData
