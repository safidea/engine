import type { Drivers } from '@adapter/spi/Drivers'
import { MailerSpi } from '@adapter/spi/MailerSpi'
import { Mailer, type Config } from '@domain/services/Mailer'
import type { Logger } from '@domain/services/Logger'

interface Ressources {
  drivers: Drivers
  logger: Logger
}

export class MailerMapper {
  static toService(ressources: Ressources, config: Partial<Config>): Mailer {
    const { drivers, ...services } = ressources
    const {
      host = ':memory:',
      port = '0',
      user = '_sqlite',
      pass = '_sqlite',
      from = 'noreply@localhost',
      secure,
    } = config
    const driver = drivers.mailer({ host, port, user, pass, from, secure })
    const spi = new MailerSpi(driver)
    return new Mailer(spi, services)
  }
}
