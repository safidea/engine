import type { Drivers } from '@adapter/spi/Drivers'
import { MailerSpi } from '@adapter/spi/MailerSpi'
import { Mailer, type Config, type Services } from '@domain/services/Mailer'

export class MailerMapper {
  static toService(drivers: Drivers, services: Services, config: Partial<Config>): Mailer {
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
