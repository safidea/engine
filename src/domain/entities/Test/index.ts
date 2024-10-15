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

  constructor(
    config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { name } = config
    this.name = name
  }

  run = async (app: App, page: BrowserPage): Promise<void> => {
    const { when, then } = this._entities
    const { logger } = this._services
    try {
      logger.debug(`running test "${this.name}"`)
      const context: { [key: string]: object } = {}
      for (const event of when) {
        const result = await event.execute(app, page)
        if (result && 'name' in event && event.name) {
          context[event.name] = result
        }
      }
      for (const expect of then) await expect.execute(app, page, context)
      logger.debug(`test "${this.name}" passed`)
      await app.stop()
    } catch (error) {
      if (error instanceof TestError) {
        logger.error(`test "${this.name}" failed with error: ${error.code}`)
        error.setName(this.name)
      }
      if (error instanceof Error) {
        logger.error(`test "${this.name}" failed with error: ${error.message}`)
        this._services.monitor.captureException(error)
      }
      await app.stop()
      throw error
    }
  }
}
