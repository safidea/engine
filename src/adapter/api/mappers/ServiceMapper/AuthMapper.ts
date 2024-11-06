import type { Drivers } from '@adapter/spi/Drivers'
import { AuthSpi } from '@adapter/spi/AuthSpi'
import { Auth, type Config, type Services } from '@domain/services/Auth'

export class AuthMapper {
  static toService(
    drivers: Drivers,
    config: Config = {
      redirectOnLogin: '/',
      redirectOnLogout: '/',
      strategy: 'magic-link',
      confirmEmail: {
        from: 'noreply@latechforce.com',
        subject: 'Please confirm your email',
        text: 'Please confirm your email',
        html: 'Please confirm your email',
      },
      secret: 'secret',
    },
    services: Services
  ): Auth {
    const driver = drivers.auth(config)
    const spi = new AuthSpi(driver)
    return new Auth(spi, services, config)
  }
}
