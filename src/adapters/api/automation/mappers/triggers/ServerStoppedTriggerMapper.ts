import { ServerStoppedTrigger } from '@entities/app/automation/triggers/ServerStoppedTrigger'
import { ServerStoppedTriggerDto } from '../../dtos/triggers/ServerStoppedTriggerDto'

export class ServerStoppedTriggerMapper {
  static toEntity(): ServerStoppedTrigger {
    return new ServerStoppedTrigger()
  }

  static toDto(): ServerStoppedTriggerDto {
    return {
      event: 'server_stopped',
    }
  }

  static toEntities(StartupTriggerDtos: ServerStoppedTriggerDto[]): ServerStoppedTrigger[] {
    return StartupTriggerDtos.map(() => this.toEntity())
  }

  static toDtos(StartupTriggers: ServerStoppedTrigger[]): ServerStoppedTriggerDto[] {
    return StartupTriggers.map(() => this.toDto())
  }
}
