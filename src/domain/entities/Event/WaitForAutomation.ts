import type { StartedApp } from '@domain/entities/App/Started'
import { type BaseEvent } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'

export interface WaitForAutomationEventConfig {
  automation: string
}

export class WaitForAutomationEvent implements BaseEvent {
  constructor(private _config: WaitForAutomationEventConfig) {}

  execute = async (app: StartedApp, _page: BrowserPage) => {
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
