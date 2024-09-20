import type { App } from '@domain/entities/App'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'

export interface Config {
  automation: string
}

export type Services = BaseServices

export class WaitForAutomation implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (app: App, _page: BrowserPage) => {
    const { automation } = this._config
    const { logger } = this._services
    logger.debug(`waiting for automation "${automation}"`)
    const timeoutPromise = new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        reject(
          new TestError({
            code: 'WAIT_FOR_AUTOMATION_TIMEOUT',
          })
        )
      }, 5000)
    })
    await Promise.race([app.queue.waitForEmpty(automation), timeoutPromise])
  }
}
