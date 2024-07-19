import { Realtime } from '@domain/services/Realtime'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Ressources {
  logger: Logger
  database: Database
  idGenerator: IdGenerator
}

export class RealtimeMapper {
  static toService(ressources: Ressources): Realtime {
    return new Realtime(ressources)
  }
}
