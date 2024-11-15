import type { AuthPayload, IAuthSpi, AuthSignOptions } from '@domain/services/Auth'

export interface IAuthDriver {
  sign: (payload: AuthPayload, options?: AuthSignOptions) => Promise<string>
  verify: (token: string) => Promise<boolean>
  decode: (token: string) => Promise<AuthPayload>
}

export class AuthSpi implements IAuthSpi {
  constructor(private _driver: IAuthDriver) {}

  sign = async (payload: AuthPayload) => {
    return this._driver.sign(payload)
  }

  verify = async (token: string) => {
    return this._driver.verify(token)
  }

  decode = async (token: string) => {
    return this._driver.decode(token)
  }
}
