import type { Driver } from '@adapter/spi/LoggerSpi'
import debug from 'debug'

export class LoggerDriver implements Driver {
  init = (location: string) => {
    const log = debug(`engine:${this._slugify(location)}`)
    return (message: string) => log(message)
  }

  private _slugify = (text: string) => {
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
