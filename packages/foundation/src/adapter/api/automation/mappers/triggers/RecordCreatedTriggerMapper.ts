import { RecordCreatedTrigger } from '@domain/entities/automation/triggers/RecordCreatedTrigger'
import { RecordCreatedTriggerDto } from '../../dtos/triggers/RecordCreatedTriggerDto'

export class RecordCreatedTriggerMapper {
  static toEntity(recordCreatedTriggerDto: RecordCreatedTriggerDto): RecordCreatedTrigger {
    return new RecordCreatedTrigger(recordCreatedTriggerDto.table)
  }

  static toDto(recordCreatedTrigger: RecordCreatedTrigger): RecordCreatedTriggerDto {
    return {
      event: 'record_created',
      table: recordCreatedTrigger.table,
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
