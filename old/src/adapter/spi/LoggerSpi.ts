import type { Params, Spi } from '@domain/services/Logger'

export interface Driver {
  params: Params
  log: (message: string) => void
}

export class LoggerSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  log = (message: string) => this.driver.log(message)
}
