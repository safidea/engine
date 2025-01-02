import type { IAuthDriver } from '@adapter/spi/drivers/AuthSpi'
import type { AuthConfig, AuthPayload, AuthSignOptions } from '@domain/services/Auth'
import jwt from 'jsonwebtoken'

export class AuthDriver implements IAuthDriver {
  constructor(private _config: AuthConfig) {}

  sign = async (payload: AuthPayload, options?: AuthSignOptions) => {
    return jwt.sign(payload, this._config.secret, options)
  }

  verify = async (token: string) => {
    try {
      jwt.verify(token, this._config.secret)
      return true
    } catch {
      return false
    }
  }

  decode = async (token: string) => {
    return jwt.verify(token, this._config.secret) as AuthPayload
  }
}
