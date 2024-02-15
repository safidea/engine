import type { Data as PersistedData } from '@domain/entities/record/Persisted'
import type { Data as ToCreateData } from '@domain/entities/record/ToCreate'

export type ToCreateDto = ToCreateData
export type ToUpdateDto = PersistedData
export type PersistedDto = PersistedData
