import type { Browser } from '@domain/services/Browser'
import type { Logger } from '@domain/services/Logger'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Event } from '../Event'
import type { Expect } from '../Expect'
import { Open } from '../Event/Open'
import {
  BaseWithRequest as EventWithRequest,
  BaseWithPage as EventWithPage,
  BaseWithPageAndMailer as EventWithPageAndMailer,
} from '../Event/base'
import {
  BaseWithPage as ExpectWithPage,
  BaseWithDatabase as ExpectWithDatabase,
  BaseWithMailer as ExpectWithMailer,
} from '../Expect/base'
import type { App } from '../App'
import { TestError } from '@domain/entities/Error/Test'

interface Params {
  name: string
  when: Event[]
  then: Expect[]
  browser: Browser
  logger: Logger
}

export class Test {
  public name: string
  private log: (message: string) => void

  constructor(private params: Params) {
    const { name, logger } = params
    this.name = name
    this.log = logger.init('test:' + this.name)
  }

  init = async () => {}

  validateConfig = async () => {
    return []
  }

  async run(app: App): Promise<TestError | undefined> {
    const { when, then, browser } = this.params
    let browserId: string | undefined
    let page: BrowserPage | undefined
    try {
      const baseUrl = await app.start({ isTest: true })
      if (
        when.find((event) => event instanceof EventWithPage) ||
        when.find((event) => event instanceof EventWithPageAndMailer) ||
        then.find((result) => result instanceof ExpectWithPage)
      ) {
        if (when.find((action) => action instanceof Open)) {
          browserId = await browser.launch()
          page = await browser.newPage(browserId, baseUrl)
        } else {
          throw new TestError({
            code: 'OPEN_ACTION_REQUIRED',
            name: this.name,
          })
        }
      }
      if (then.find((result) => result instanceof ExpectWithDatabase)) {
        if (!app.database) throw new TestError({ code: 'DATABASE_REQUIRED', name: this.name })
      }
      if (
        when.find((action) => action instanceof EventWithPageAndMailer) ||
        then.find((result) => result instanceof ExpectWithMailer)
      ) {
        if (!app.mailer) throw new TestError({ code: 'MAILER_REQUIRED', name: this.name })
      }
      for (const action of when) {
        if (action instanceof EventWithPage) {
          if (page) await action.executeWithPage(page)
        } else if (action instanceof EventWithPageAndMailer) {
          if (page && app.mailer) await action.executeWithPageAndMailer(page, app.mailer)
        } else if (action instanceof EventWithRequest) {
          await action.executeWithRequest(baseUrl)
        } else {
          await action.executeWithApp(app)
        }
      }
      for (const result of then) {
        if (result instanceof ExpectWithPage) {
          if (page) await result.executeWithPage(page)
        } else if (result instanceof ExpectWithDatabase) {
          if (app.database) await result.executeWithDatabase(app.database)
        } else if (result instanceof ExpectWithMailer) {
          if (app.mailer) await result.executeWithMailer(app.mailer)
        }
      }
      if (browserId) await browser.close(browserId)
      await app.stop()
      this.log('passed')
    } catch (error) {
      const html = page ? await page.getHtml() : ''
      if (browserId) await browser.close(browserId)
      await app.stop()
      if (error instanceof TestError) {
        this.log('failed: ' + error.code)
        if (html) this.log('html: ' + html)
        error.setName(this.name)
        return error
      } else throw error
    }
  }
}
