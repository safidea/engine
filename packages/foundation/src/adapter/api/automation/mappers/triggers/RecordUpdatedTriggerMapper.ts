import { RecordUpdatedTrigger } from '@domain/entities/automation/triggers/RecordUpdatedTrigger'
import { RecordUpdatedTriggerDto } from '../../dtos/triggers/RecordUpdatedTriggerDto'

export class RecordUpdatedTriggerMapper {
  static toEntity(recordUpdatedTriggerDto: RecordUpdatedTriggerDto): RecordUpdatedTrigger {
    return new RecordUpdatedTrigger(recordUpdatedTriggerDto.table, recordUpdatedTriggerDto.fields)
  }

  static toDto(recordUpdatedTrigger: RecordUpdatedTrigger): RecordUpdatedTriggerDto {
    return {
      event: 'record_updated',
      table: recordUpdatedTrigger.table,
      fields: recordUpdatedTrigger.fields,
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
