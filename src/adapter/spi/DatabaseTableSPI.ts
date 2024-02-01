import type { ToCreateRecord } from '@domain/services/record/ToCreateRecord'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { DatabaseFilterMapper } from './mappers/DatabaseFilterMapper'
import type { Filter } from '@domain/services/filter'
import type { DatabaseTableColumnDto } from './dtos/DatabaseTableColumnDto'
import type { DatabaseFilterDto } from './dtos/DatabaseFilterDto'
import type { DatabaseTableSPI as IDatabaseTableSPI } from '@domain/services/DatabaseTable'
import type { ToCreateRecordDto } from './dtos/ToCreateRecordDto'
import type { PersistedRecordDto } from './dtos/PersistedRecordDto'

export interface DatabaseTableDriver {
  create: (columns: DatabaseTableColumnDto[]) => Promise<void>
  addColumn: (column: DatabaseTableColumnDto) => Promise<void>
  dropColumn: (name: string) => Promise<void>
  drop: () => Promise<void>
  insert: (record: ToCreateRecordDto) => Promise<PersistedRecordDto>
  read: (filters: DatabaseFilterDto[]) => Promise<PersistedRecordDto | undefined>
}

export class DatabaseTableSPI implements IDatabaseTableSPI {
  constructor(private driver: DatabaseTableDriver) {}

  insert = async (toCreateRecord: ToCreateRecord) => {
    const toCreateRecordDto = RecordMapper.toCreateDto(toCreateRecord)
    const persistedRecordDto = await this.driver.insert(toCreateRecordDto)
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }

  read = async (filters: Filter[]) => {
    const filterDtos = DatabaseFilterMapper.toManyDtos(filters)
    const persistedRecordDto = await this.driver.read(filterDtos)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }
}
