import type { Table } from '@domain/entities/table/Table'
import type { EngineErrorDto } from './EngineErrorDto'

export interface CreateTableResultDto {
  table?: Table
  errors: EngineErrorDto[]
}
