export interface MonitorSentryConfig {
  driver: 'Sentry'
  dsn: string
  environment: string
}

export interface MonitorConsoleConfig {
  driver: 'Console'
}

export type MonitorConfig = MonitorSentryConfig | MonitorConsoleConfig
export type MonitorsConfig = MonitorConfig[]
export type MonitorDrivers = ('Sentry' | 'Console')[]

export interface IMonitorSpi {
  captureException: (error: Error) => void
  captureMessage: (message: string) => void
}

export class Monitor {
  public drivers: MonitorDrivers

  constructor(
    private _spi: IMonitorSpi,
    config: MonitorsConfig
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
