import type { Browser } from '@domain/services/Browser'
import type { Logger } from '@domain/services/Logger'
import type { Base } from '../base'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Action } from './action'
import type { Result } from './result'
import { Open } from './action/Open'
import { BaseWithRequest as ActionWithRequest, BaseWithPage as ActionWithPage } from './action/base'
import {
  BaseWithPage as ResultWithPage,
  BaseWithDatabase as ResultWithDatabase,
} from './result/base'
import type { App } from '../App'
import { TestError } from '@domain/entities/error/Test'

interface Params {
  name: string
  when: Action[]
  then: Result[]
  newBrowser: () => Browser
  logger: Logger
  feature: string
}

export class Spec implements Base {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }

  async test(app: App): Promise<TestError | undefined> {
    const { when, then, newBrowser, logger, feature } = this.params
    let browser: Browser | undefined
    let page: BrowserPage | undefined
    try {
      const baseUrl = await app.start({ isTest: true })
      if (
        when.find((action) => action instanceof ActionWithPage) ||
        then.find((result) => result instanceof ResultWithPage)
      ) {
        if (when.find((action) => action instanceof Open)) {
          browser = newBrowser()
          page = await browser.launch({ baseUrl })
        } else {
          throw new TestError({
            code: 'OPEN_ACTION_REQUIRED',
            feature,
            spec: this.name,
          })
        }
      }
      if (then.find((result) => result instanceof ResultWithDatabase)) {
        if (!app.database)
          throw new TestError({ code: 'DATABASE_REQUIRED', feature, spec: this.name })
      }
      for (const action of when) {
        if (action instanceof ActionWithPage) {
          if (page) await action.executeWithPage(page)
        } else if (action instanceof ActionWithRequest) {
          await action.executeWithRequest(baseUrl)
        } else {
          await action.executeWithApp(app)
        }
      }
      for (const result of then) {
        if (result instanceof ResultWithPage) {
          if (page) await result.executeWithPage(page)
        } else {
          if (app.database) await result.executeWithDatabase(app.database)
        }
      }
      if (browser) await browser.close()
      await app.stop()
      logger.log('passed')
    } catch (error) {
      const html = page ? await page.getHtml() : ''
      if (browser) await browser.close()
      await app.stop()
      if (error instanceof TestError) {
        logger.log('failed: ' + error.code)
        if (html) logger.log('html: ' + html)
        return error
      } else throw error
    }
  }
}
