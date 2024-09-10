import { Realtime } from '@domain/services/Realtime'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Table } from '@domain/entities/Table'

interface Ressources {
  logger: Logger
  database: Database
  idGenerator: IdGenerator
  tables: Table[]
}

export class RealtimeMapper {
  static toService(ressources: Ressources): Realtime {
    const { tables, ...services } = ressources
    return new Realtime(services, { tables })
  }
}
