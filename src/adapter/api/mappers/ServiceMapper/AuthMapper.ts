import type { Drivers } from '@adapter/spi/Drivers'
import { AuthSpi } from '@adapter/spi/AuthSpi'
import { Auth, type Config, type Services } from '@domain/services/Auth'

export class AuthMapper {
  static toService(drivers: Drivers, services: Services, config: Partial<Config>): Auth {
    const {
      redirectOnLogin = '/',
      redirectOnLogout = '/',
      strategy = 'magic-link',
      confirmEmail: {
        from = 'noreply@safidea.com',
        subject = 'Please confirm your email',
        text = 'Please confirm your email',
        html = 'Please confirm your email',
      } = {},
      secret = 'secret',
    } = config
    const driver = drivers.auth({
      secret,
      redirectOnLogin,
      redirectOnLogout,
      strategy,
      confirmEmail: { subject, text, html, from },
    })
    const spi = new AuthSpi(driver)
    return new Auth(spi, services, {
      secret,
      redirectOnLogin,
      redirectOnLogout,
      strategy,
      confirmEmail: { subject, text, html, from },
    })
  }
}
