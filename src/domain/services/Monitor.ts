export type Driver = 'Sentry' | 'Console'

export type Config = {
  driver: Driver
}

export interface Spi {
  captureException: (error: Error) => void
  captureMessage: (message: string) => void
}

export class Monitor {
  public driver: Driver

  constructor(
    private _spi: Spi,
    config: Config
  ) {
    this.driver = config.driver
  }

  captureException = (error: Error) => {
    this._spi.captureException(error)
  }

  captureMessage = (message: string) => {
    this._spi.captureMessage(message)
  }
}
