import type { Drivers } from '@adapter/spi/drivers'
import type { DatabaseConfig } from '@domain/services/Database'
import type { MailerConfig } from '@domain/services/Mailer'

import { DatabaseDriver } from './DatabaseDriver'
import { MailerDriver } from './MailerDriver'

export const drivers: Partial<Drivers> = {
  database: (config: DatabaseConfig) => new DatabaseDriver(config),
  mailer: (config: MailerConfig) => new MailerDriver(config),
}
