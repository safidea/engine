import type { Driver } from '@adapter/spi/AuthSpi'
import type { Params, Payload, SignOptions } from '@domain/services/Auth'
import jwt from 'jsonwebtoken'

export class AuthDriver implements Driver {
  constructor(public params: Params) {}

  sign = async (payload: Payload, options?: SignOptions) => {
    return jwt.sign(payload, this.params.secret, options)
  }

  verify = async (token: string) => {
    try {
      jwt.verify(token, this.params.secret)
      return true
    } catch {
      return false
    }
  }

  decode = async (token: string) => {
    return jwt.verify(token, this.params.secret) as Payload
  }
}
