export interface LoggerSpi {
  log: (message: string) => void
}

export class Logger {
  constructor(private spi: LoggerSpi) {}

  private slugify(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
  }

  log(message: string) {
    const slug = this.slugify(message)
    this.spi.log(slug)
  }
}
