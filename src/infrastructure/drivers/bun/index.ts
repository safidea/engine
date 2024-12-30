import type { Drivers } from '@adapter/spi/drivers'
import type { DatabaseConfig } from '@domain/services/Database'

import { BunDatabaseDriver } from './DatabaseDriver/BunDriver'

export const drivers: Partial<Drivers> = {
  database: (config: DatabaseConfig) => new BunDatabaseDriver(config),
}
