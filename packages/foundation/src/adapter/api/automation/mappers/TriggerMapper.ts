import { ServerStartedTrigger } from '@domain/entities/automation/triggers/ServerStartedTrigger'
import { TriggerDto } from '../dtos/TriggerDto'
import { RecordCreatedTrigger } from '@domain/entities/automation/triggers/RecordCreatedTrigger'
import { Trigger } from '@domain/entities/automation/Trigger'
import { RecordCreatedTriggerMapper } from './triggers/RecordCreatedTriggerMapper'
import { ServerStartedTriggerMapper } from './triggers/ServerStartedTriggerMapper'
import { ServerStoppedTriggerMapper } from './triggers/ServerStoppedTriggerMapper'
import { ServerStoppedTrigger } from '@domain/entities/automation/triggers/ServerStoppedTrigger'

export class TriggerMapper {
  static toEntity(triggerDto: TriggerDto): Trigger {
    const { event } = triggerDto
    if (event === 'server_started') {
      return ServerStartedTriggerMapper.toEntity()
    }
    if (event === 'server_stopped') {
      return ServerStoppedTriggerMapper.toEntity()
    }
    if (event === 'record_created') {
      return RecordCreatedTriggerMapper.toEntity(triggerDto)
    }
    throw new Error(`Invalid trigger event ${event}`)
  }

  static toDto(trigger: Trigger): TriggerDto {
    if (trigger instanceof ServerStartedTrigger) {
      return ServerStartedTriggerMapper.toDto()
    }
    if (trigger instanceof ServerStoppedTrigger) {
      return ServerStoppedTriggerMapper.toDto()
    }
    if (trigger instanceof RecordCreatedTrigger) {
      return RecordCreatedTriggerMapper.toDto(trigger)
    }
    throw new Error(`Invalid trigger instance ${trigger}`)
  }

  static toEntities(triggerDtos: TriggerDto[]): Trigger[] {
    return triggerDtos.map((triggerDto) => this.toEntity(triggerDto))
  }

  static toDtos(triggers: Trigger[]): TriggerDto[] {
    return triggers.map((trigger) => this.toDto(trigger))
  }
}
