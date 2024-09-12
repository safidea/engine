import type { Logger } from '@domain/services/Logger'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Event } from '../Event'
import type { Expect } from '../Expect'
import type { App } from '../App'
import { TestError } from '@domain/entities/Error/Test'
import type { Monitor } from '@domain/services/Monitor'

interface Config {
  name: string
}

interface Services {
  logger: Logger
  monitor: Monitor
}

interface Entities {
  when: Event[]
  then: Expect[]
}

export class Test {
  public name: string
  private _log: (message: string) => void

  constructor(
    config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { name } = config
    const { logger } = _services
    this.name = name
    this._log = logger.init('test:' + this.name)
  }

  run = async (app: App, page: BrowserPage): Promise<void> => {
    const { when, then } = this._entities
    try {
      this._log('start')
      for (const event of when) await event.execute(app, page)
      for (const expect of then) await expect.execute(app, page)
      this._log('passed')
      await app.stop()
    } catch (error) {
      if (error instanceof TestError) {
        this._log('failed: ' + error.code)
        error.setName(this.name)
      }
      if (error instanceof Error) this._services.monitor.captureException(error)
      await app.stop()
      throw error
    }
  }
}
