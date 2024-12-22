import { Realtime, type RealtimeServices, type RealtimeEntities } from '@domain/services/Realtime'

export class RealtimeMapper {
  static toService(services: RealtimeServices, entities: RealtimeEntities): Realtime {
    return new Realtime(services, entities)
  }
}
