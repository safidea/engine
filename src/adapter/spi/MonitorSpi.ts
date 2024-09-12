import type { Spi } from '@domain/services/Monitor'

export interface Driver {
  captureException: (error: Error) => void
  captureMessage: (message: string) => void
}

export class MonitorSpi implements Spi {
  constructor(private _driver: Driver) {}

  captureException = (error: Error) => {
    this._driver.captureException(error)
  }

  captureMessage = (message: string) => {
    this._driver.captureMessage(message)
  }
}
