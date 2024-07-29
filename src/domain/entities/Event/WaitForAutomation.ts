import type { App } from '@domain/entities/App'
import { BaseWithApp, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  automation: string
}

export class WaitForAutomation extends BaseWithApp {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('event:wait-for-automation')
  }

  executeWithApp = async (app: App) => {
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
    await Promise.race([
      app.queue.waitFor({ name: automation, state: 'completed' }),
      timeoutPromise,
    ])
  }
}
