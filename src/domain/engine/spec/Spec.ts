import type { Browser } from '@domain/services/Browser'
import type { Logger } from '@domain/services/Logger'
import type { Base } from '../Base'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Action } from './action'
import type { Result } from './result'
import { Open } from './action/Open'
import {
  BaseWithRequest as ActionWithRequest,
  BaseWithPage as ActionWithPage,
  BaseWithPageAndMailer as ActionWithPageAndMailer,
} from './action/base'
import {
  BaseWithPage as ResultWithPage,
  BaseWithDatabase as ResultWithDatabase,
  BaseWithMailer as ResultWithMailer,
} from './result/base'
import type { App } from '../App'
import { TestError } from '@domain/entities/error/Test'

interface Params {
  name: string
  when: Action[]
  then: Result[]
  newBrowser: () => Browser
  logger: Logger
}

export class Spec implements Base {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  init = async () => {}

  validateConfig = async () => {
    return []
  }

  async test(app: App): Promise<TestError | undefined> {
    const { when, then, newBrowser, logger } = this.params
    let browser: Browser | undefined
    let page: BrowserPage | undefined
    try {
      const baseUrl = await app.start({ isTest: true })
      if (
        when.find((action) => action instanceof ActionWithPage) ||
        when.find((action) => action instanceof ActionWithPageAndMailer) ||
        then.find((result) => result instanceof ResultWithPage)
      ) {
        if (when.find((action) => action instanceof Open)) {
          browser = newBrowser()
          page = await browser.launch(baseUrl)
        } else {
          throw new TestError({
            code: 'OPEN_ACTION_REQUIRED',
            spec: this.name,
          })
        }
      }
      if (then.find((result) => result instanceof ResultWithDatabase)) {
        if (!app.database) throw new TestError({ code: 'DATABASE_REQUIRED', spec: this.name })
      }
      if (
        when.find((action) => action instanceof ActionWithPageAndMailer) ||
        then.find((result) => result instanceof ResultWithMailer)
      ) {
        if (!app.mailer) throw new TestError({ code: 'MAILER_REQUIRED', spec: this.name })
      }
      for (const action of when) {
        if (action instanceof ActionWithPage) {
          if (page) await action.executeWithPage(page)
        } else if (action instanceof ActionWithPageAndMailer) {
          if (page && app.mailer) await action.executeWithPageAndMailer(page, app.mailer)
        } else if (action instanceof ActionWithRequest) {
          await action.executeWithRequest(baseUrl)
        } else {
          await action.executeWithApp(app)
        }
      }
      for (const result of then) {
        if (result instanceof ResultWithPage) {
          if (page) await result.executeWithPage(page)
        } else if (result instanceof ResultWithDatabase) {
          if (app.database) await result.executeWithDatabase(app.database)
        } else if (result instanceof ResultWithMailer) {
          if (app.mailer) await result.executeWithMailer(app.mailer)
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
