import type { Drivers } from '@adapter/spi/Drivers'
import { AuthSpi } from '@adapter/spi/AuthSpi'
import { Auth, type Config } from '@domain/services/Auth'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Database } from '@domain/services/Database'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'

interface Ressources {
  drivers: Drivers
  logger: Logger
  database: Database
  server: Server
  mailer: Mailer
  templateCompiler: TemplateCompiler
}

export class AuthMapper {
  static toService(ressources: Ressources, config: Partial<Config>): Auth {
    const { drivers, ...services } = ressources
    const {
      redirectOnLogin = '/',
      redirectOnLogout = '/',
      strategy = 'magic-link',
      confirmEmail: {
        subject = 'Please confirm your email',
        text = 'Please confirm your email',
        html = 'Please confirm your email',
      } = {},
      from = 'noreply@safidea.com',
      secret = 'secret',
    } = config
    const driver = drivers.auth({
      secret,
      from,
      redirectOnLogin,
      redirectOnLogout,
      strategy,
      confirmEmail: { subject, text, html },
    })
    const spi = new AuthSpi(driver)
    return new Auth(spi, services, {
      secret,
      from,
      redirectOnLogin,
      redirectOnLogout,
      strategy,
      confirmEmail: { subject, text, html },
    })
  }
}
