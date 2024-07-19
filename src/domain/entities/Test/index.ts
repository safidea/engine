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

  run = async (app: App): Promise<void> => {
    const { when, then, browser } = this.params
    let browserId: string | undefined
    let page: BrowserPage | undefined
    try {
      this.log('start')
      await app.init()
      const baseUrl = await app.start({ isTest: true })
      if (
        when.find((event) => event instanceof EventWithPage) ||
        when.find((event) => event instanceof EventWithPageAndMailer) ||
        then.find((expect) => expect instanceof ExpectWithPage)
      ) {
        if (when.find((event) => event instanceof Open)) {
          browserId = await browser.launch()
          page = await browser.newPage(browserId, baseUrl)
        } else {
          throw new TestError({
            code: 'OPEN_ACTION_REQUIRED',
            name: this.name,
          })
        }
      }
      if (then.find((expect) => expect instanceof ExpectWithDatabase)) {
        if (!app.database) throw new TestError({ code: 'DATABASE_REQUIRED', name: this.name })
      }
      if (
        when.find((event) => event instanceof EventWithPageAndMailer) ||
        then.find((expect) => expect instanceof ExpectWithMailer)
      ) {
        if (!app.mailer) throw new TestError({ code: 'MAILER_REQUIRED', name: this.name })
      }
      for (const event of when) {
        if (event instanceof EventWithPage) {
          if (page) await event.executeWithPage(page)
        } else if (event instanceof EventWithPageAndMailer) {
          if (page && app.mailer) await event.executeWithPageAndMailer(page, app.mailer)
        } else if (event instanceof EventWithRequest) {
          await event.executeWithRequest(baseUrl)
        } else {
          await event.executeWithApp(app)
        }
      }
      for (const expect of then) {
        if (expect instanceof ExpectWithPage) {
          if (page) await expect.executeWithPage(page)
        } else if (expect instanceof ExpectWithDatabase) {
          if (app.database) await expect.executeWithDatabase(app.database)
        } else if (expect instanceof ExpectWithMailer) {
          if (app.mailer) await expect.executeWithMailer(app.mailer)
        }
      }
      this.log('passed')
      if (browserId) await browser.close(browserId)
      await app.stop()
    } catch (error) {
      if (error instanceof TestError) {
        this.log('failed: ' + error.code)
        const html = page ? await page.getHtml() : ''
        if (html) this.log('html: ' + html)
        error.setName(this.name)
      }
      if (browserId) await browser.close(browserId)
      await app.stop()
      throw error
    }
  }
}
