export interface Config {
  store: true
}

export interface Spi {
  init: (location: string) => (message: string) => void
}

export class Logger {
  constructor(private spi: Spi) {}

  init = (location: string) => {
    return this.spi.init(location)
  }
}
