import type { App } from '@domain/entities/App'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'

export interface Config {
  automation: string
}

export class WaitForAutomation implements Base {
  constructor(private _config: Config) {}

  execute = async (app: App, _page: BrowserPage) => {
    const { automation } = this._config
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
