import type { Spi } from '@domain/services/Logger'

export interface Driver {
  init: (location: string) => (message: string) => void
}

export class LoggerSpi implements Spi {
  constructor(private driver: Driver) {}

  init = (location: string) => this.driver.init(location)
}
