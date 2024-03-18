import type { Params, Payload, Spi, SignOptions } from '@domain/services/Auth'

export interface Driver {
  params: Params
  sign: (payload: Payload, options?: SignOptions) => Promise<string>
  verify: (token: string) => Promise<boolean>
  decode: (token: string) => Promise<Payload>
}

export class AuthSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  sign = async (payload: Payload) => {
    return this.driver.sign(payload)
  }

  verify = async (token: string) => {
    return this.driver.verify(token)
  }

  decode = async (token: string) => {
    return this.driver.decode(token)
  }
}
