import type { ToCreate } from '@domain/services/Record/ToCreate'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { DatabaseFilterMapper } from './mappers/DatabaseFilterMapper'
import type { Filter } from '@domain/services/Filter'
import type { DatabaseTableColumnDto } from './dtos/DatabaseTableColumnDto'
import type { DatabaseFilterDto } from './dtos/DatabaseFilterDto'
import type { DatabaseTableSPI as IDatabaseTableSPI } from '@domain/services/DatabaseTable'
import type { PersistedDto, ToCreateDto } from './dtos/RecordDto'

export interface DatabaseTableDriver {
  create: (columns: DatabaseTableColumnDto[]) => Promise<void>
  addColumn: (column: DatabaseTableColumnDto) => Promise<void>
  dropColumn: (name: string) => Promise<void>
  drop: () => Promise<void>
  insert: (record: ToCreateDto) => Promise<PersistedDto>
  read: (filters: DatabaseFilterDto[]) => Promise<PersistedDto | undefined>
}

export class DatabaseTableSPI implements IDatabaseTableSPI {
  constructor(private driver: DatabaseTableDriver) {}

  insert = async (toCreateRecord: ToCreate) => {
    const toCreateRecordDto = RecordMapper.toCreateDto(toCreateRecord)
    const persistedRecordDto = await this.driver.insert(toCreateRecordDto)
    return RecordMapper.toPersistedService(persistedRecordDto)
  }

  read = async (filters: Filter[]) => {
    const filterDtos = DatabaseFilterMapper.toManyDtos(filters)
    const persistedRecordDto = await this.driver.read(filterDtos)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toPersistedService(persistedRecordDto)
  }
}
