import type { Driver } from '@adapter/spi/LoggerSpi'
import type { Params } from '@domain/services/Logger'
import debug from 'debug'

export class DebugLoggerDriver implements Driver {
  public log: (message: string) => void

  constructor(public params: Params) {
    this.log = debug(`engine:${this.slugify(params.location)}`)
  }

  slugify(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
  }
}
