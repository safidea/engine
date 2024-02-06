import type { LoggerDriver } from '@adapter/spi/LoggerSpi'
import debug from 'debug'

export class DebugLoggerDriver implements LoggerDriver {
  public log: (message: string) => void

  constructor(location: string) {
    this.log = debug(`engine:${this.slugify(location)}`)
  }

  slugify(text: string) {
    return (
      text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
    )
  }
}
