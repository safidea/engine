export interface LoggerSpi {
  log: (message: string) => void
}

export class Logger {
  constructor(private spi: LoggerSpi) {}

  log(message: string) {
    this.spi.log(message)
  }
}
