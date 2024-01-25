import debug from 'debug'
import type { ILogger } from '@domain/drivers/ILogger'

export class DebugLogger implements ILogger {
  init(location: string) {
    const log = debug(`engine:${location}`)
    return (message: string) => log(message)
  }

  slug(name: string) {
    return name.replace(/\s+/g, '-').toLowerCase()
  }
}
