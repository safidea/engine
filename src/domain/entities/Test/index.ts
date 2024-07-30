import type { Logger } from '@domain/services/Logger'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Event } from '../Event'
import type { Expect } from '../Expect'
import type { App } from '../App'
import { TestError } from '@domain/entities/Error/Test'

interface Params {
  name: string
  when: Event[]
  then: Expect[]
  logger: Logger
}

export class Test {
  public name: string
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { name, logger } = _params
    this.name = name
    this._log = logger.init('test:' + this.name)
  }

  run = async (app: App, page: BrowserPage): Promise<void> => {
    const { when, then } = this._params
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
      await app.stop()
      throw error
    }
  }
}
