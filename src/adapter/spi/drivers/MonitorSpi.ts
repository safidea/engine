import type { IMonitorSpi } from '@domain/services/Monitor'

export interface IMonitorDriver {
  captureException: (error: Error) => void
  captureMessage: (message: string) => void
}

export class MonitorSpi implements IMonitorSpi {
  constructor(private _driver: IMonitorDriver) {}

  captureException = (error: Error) => {
    this._driver.captureException(error)
  }

  captureMessage = (message: string) => {
    this._driver.captureMessage(message)
  }
}
