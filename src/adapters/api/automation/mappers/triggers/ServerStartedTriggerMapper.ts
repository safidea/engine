import { ServerStartedTrigger } from '@entities/app/automation/triggers/ServerStartedTrigger'
import { ServerStartedTriggerDto } from '../../dtos/triggers/ServerStartedTriggerDto'

export class ServerStartedTriggerMapper {
  static toEntity(): ServerStartedTrigger {
    return new ServerStartedTrigger()
  }

  static toDto(): ServerStartedTriggerDto {
    return {
      event: 'server_started',
    }
  }

  static toEntities(StartupTriggerDtos: ServerStartedTriggerDto[]): ServerStartedTrigger[] {
    return StartupTriggerDtos.map(() => this.toEntity())
  }

  static toDtos(StartupTriggers: ServerStartedTrigger[]): ServerStartedTriggerDto[] {
    return StartupTriggers.map(() => this.toDto())
  }
}
