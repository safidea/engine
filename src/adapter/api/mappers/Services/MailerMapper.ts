import type { Drivers } from '@adapter/spi/drivers'
import { MailerSpi } from '@adapter/spi/drivers/MailerSpi'
import { Mailer, type MailerConfig, type MailerServices } from '@domain/services/Mailer'

export class MailerMapper {
  static toService(
    drivers: Drivers,
    config: MailerConfig = {
      host: ':memory:',
      port: '0',
      user: '_sqlite',
      pass: '_sqlite',
      from: 'noreply@localhost',
    },
    services: MailerServices
  ): Mailer {
    const driver = drivers.mailer(config)
    const spi = new MailerSpi(driver)
    return new Mailer(spi, services)
  }
}
