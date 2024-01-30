import type { Server } from '@domain/services/server/Server'
import type { IEntityParams } from '../IEntityParams'
import type { Database } from '@domain/services/database/Database'
import type { Logger } from '@domain/services/logger/Logger'

export interface TableParams extends IEntityParams {
  server: Server
  database: Database
  logger: Logger
}
