import type { App } from '@domain/engine/App'
import { BaseWithApp, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  waitForAutomation: string
}

export class WaitForAutomation extends BaseWithApp {
  constructor(private params: Params) {
    super()
  }

  executeWithApp = async (app: App) => {
    const { waitForAutomation, logger, feature, spec } = this.params
    if (!app.queue) {
      throw new TestError({
        code: 'NO_QUEUE',
        feature,
        spec,
      })
    }
    logger.log(`waiting for automation "${waitForAutomation}"`)
    const timeoutPromise = new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        reject(
          new TestError({
            code: 'WAIT_FOR_AUTOMATION_TIMEOUT',
            feature,
            spec,
          })
        )
      }, 5000)
    })
    await Promise.race([
      app.queue.waitFor({ name: waitForAutomation, state: 'completed' }),
      timeoutPromise,
    ])
  }
}
