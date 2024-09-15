import { Realtime, type Services, type Entities } from '@domain/services/Realtime'

export class RealtimeMapper {
  static toService(services: Services, entities: Entities): Realtime {
    return new Realtime(services, entities)
  }
}
