export interface SentryConfig {
  driver: 'Sentry'
  dsn: string
  environment: string
}

export interface ConsoleConfig {
  driver: 'Console'
}

export type Config = (SentryConfig | ConsoleConfig)[]
export type Drivers = ('Sentry' | 'Console')[]

export interface Spi {
  captureException: (error: Error) => void
  captureMessage: (message: string) => void
}

export class Monitor {
  public drivers: Drivers

  constructor(
    private _spi: Spi,
    config: Config
  ) {
    this.drivers = config.map((c) => c.driver)
  }

  captureException = (error: Error) => {
    this._spi.captureException(error)
  }

  captureMessage = (message: string) => {
    this._spi.captureMessage(message)
  }
}
