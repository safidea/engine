import { RecordCreatedTrigger } from '@entities/app/automation/triggers/RecordCreatedTrigger'
import { RecordCreatedTriggerDto } from '../../dtos/triggers/RecordCreatedTriggerDto'
import { FilterMapper } from '@adapters/spi/orm/mappers/FilterMapper'

export class RecordCreatedTriggerMapper {
  static toEntity(recordCreatedTriggerDto: RecordCreatedTriggerDto): RecordCreatedTrigger {
    const filters = FilterMapper.toEntities(recordCreatedTriggerDto.filters ?? [])
    return new RecordCreatedTrigger(recordCreatedTriggerDto.table, filters)
  }

  static toDto(recordCreatedTrigger: RecordCreatedTrigger): RecordCreatedTriggerDto {
    const filters = FilterMapper.toDtos(recordCreatedTrigger.filters)
    return {
      event: 'record_created',
      table: recordCreatedTrigger.table,
      filters,
    }
  }

  static toEntities(recordCreatedTriggerDtos: RecordCreatedTriggerDto[]): RecordCreatedTrigger[] {
    return recordCreatedTriggerDtos.map((recordCreatedTriggerDto) =>
      this.toEntity(recordCreatedTriggerDto)
    )
  }

  static toDtos(recordCreatedTriggers: RecordCreatedTrigger[]): RecordCreatedTriggerDto[] {
    return recordCreatedTriggers.map((recordCreatedTrigger) => this.toDto(recordCreatedTrigger))
  }
}
