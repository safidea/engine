export interface Params {
  location: string
}

export interface Spi {
  params: Params
  log: (message: string) => void
}

export class Logger {
  constructor(private spi: Spi) {}

  log = (message: string) => {
    this.spi.log(message)
  }
}
