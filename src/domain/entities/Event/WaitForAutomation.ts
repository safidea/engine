import type { App } from '@domain/entities/App'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'

interface Params extends BaseParams {
  automation: string
}

export class WaitForAutomation implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:wait-for-automation')
  }

  execute = async (app: App, _page: BrowserPage) => {
    const { automation } = this._params
    if (!app.queue) {
      throw new TestError({
        code: 'NO_QUEUE',
      })
    }
    this._log(`waiting for automation "${automation}"`)
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
