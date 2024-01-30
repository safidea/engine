import type { IDatabaseTableMapper } from '@domain/mappers/IDatabaseTableMapper'
import type { IDatabaseTableDriver } from '../drivers/IDatabaseTableDriver'
import type { RecordToCreate } from '@domain/services/record/toCreate/RecordToCreate'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'

export class DatabaseTableMapper implements IDatabaseTableMapper {
  constructor(private driver: IDatabaseTableDriver) {}

  insert = async (recordToCreate: RecordToCreate) => {
    const recordToCreateDto = RecordMapper.toCreateDto(recordToCreate)
    const persistedRecordDto = await this.driver.insert(recordToCreateDto)
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }
}
