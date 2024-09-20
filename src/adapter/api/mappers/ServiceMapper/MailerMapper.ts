import type { Drivers } from '@adapter/spi/Drivers'
import { MailerSpi } from '@adapter/spi/MailerSpi'
import { Mailer, type Config, type Services } from '@domain/services/Mailer'

export class MailerMapper {
  static toService(
    drivers: Drivers,
    config: Config = {
      host: ':memory:',
      port: '0',
      user: '_sqlite',
      pass: '_sqlite',
      from: 'noreply@localhost',
    },
    services: Services
  ): Mailer {
    const driver = drivers.mailer(config)
    const spi = new MailerSpi(driver)
    return new Mailer(spi, services)
  }
}
