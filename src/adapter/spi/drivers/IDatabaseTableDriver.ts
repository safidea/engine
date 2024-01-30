import type { RecordDto } from '@adapter/spi/dtos/RecordDto'
import type { DatabaseTableColumnDto } from '../dtos/DatabaseTableColumnDto'

export interface IDatabaseTableDriver {
  create: (columns: DatabaseTableColumnDto[]) => Promise<void>
  addColumn: (column: DatabaseTableColumnDto) => Promise<void>
  dropColumn: (name: string) => Promise<void>
  drop: () => Promise<void>
  insert: (data: RecordDto) => Promise<RecordDto>
  read: (data: RecordDto) => Promise<RecordDto | undefined>
}
