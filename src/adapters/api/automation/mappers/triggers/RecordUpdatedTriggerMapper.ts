import { RecordUpdatedTrigger } from '@entities/app/automation/triggers/RecordUpdatedTrigger'
import { RecordUpdatedTriggerDto } from '../../dtos/triggers/RecordUpdatedTriggerDto'
import { FilterMapper } from '@adapters/spi/orm/mappers/FilterMapper'

export class RecordUpdatedTriggerMapper {
  static toEntity(recordUpdatedTriggerDto: RecordUpdatedTriggerDto): RecordUpdatedTrigger {
    const filters = FilterMapper.toEntities(recordUpdatedTriggerDto.filters ?? [])
    return new RecordUpdatedTrigger(
      recordUpdatedTriggerDto.table,
      recordUpdatedTriggerDto.fields,
      filters
    )
  }

  static toDto(recordUpdatedTrigger: RecordUpdatedTrigger): RecordUpdatedTriggerDto {
    const filters = FilterMapper.toDtos(recordUpdatedTrigger.filters)
    return {
      event: 'record_updated',
      table: recordUpdatedTrigger.table,
      fields: recordUpdatedTrigger.fields,
      filters,
    }
  }

  static toEntities(recordCreatedTriggersDtos: RecordUpdatedTriggerDto[]): RecordUpdatedTrigger[] {
    return recordCreatedTriggersDtos.map((recordUpdatedTriggerDto) =>
      this.toEntity(recordUpdatedTriggerDto)
    )
  }

  static toDtos(recordUpdatedTriggers: RecordUpdatedTrigger[]): RecordUpdatedTriggerDto[] {
    return recordUpdatedTriggers.map((recordUpdatedTrigger) => this.toDto(recordUpdatedTrigger))
  }
}
