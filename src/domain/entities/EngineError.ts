import type { PageError } from './PageError'
import type { TableError } from './TableError'

export type EngineErrorCode = 'UNKNOWN_SCHEMA_ERROR'

export type EngineError = TableError | PageError
