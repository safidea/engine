import type { Spi } from '@domain/services/Logger'

export interface Driver {
  init: (location: string) => (message: string) => void
}

export class LoggerSpi implements Spi {
  constructor(private _driver: Driver) {}

  init = (location: string) => this._driver.init(location)
}
