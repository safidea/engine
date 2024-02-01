export interface LoggerSPI {
  log: (message: string) => void
}

export class Logger {
  constructor(private spi: LoggerSPI) {}

  log(message: string) {
    this.spi.log(message)
  }
}
