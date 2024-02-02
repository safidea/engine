import type { PageError } from './page/PageError'
import type { SpecError } from './spec/SpecError'
import type { TableError } from './table/TableError'

export type EngineErrorCode = 'UNKNOWN_SCHEMA_ERROR'

export type EngineError = TableError | PageError | SpecError
