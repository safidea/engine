import type { Driver } from '@adapter/spi/drivers/AuthSpi'
import type { Config, Payload, SignOptions } from '@domain/services/Auth'
import jwt from 'jsonwebtoken'

export class AuthDriver implements Driver {
  constructor(private _config: Config) {}

  sign = async (payload: Payload, options?: SignOptions) => {
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
    return jwt.verify(token, this._config.secret) as Payload
  }
}
