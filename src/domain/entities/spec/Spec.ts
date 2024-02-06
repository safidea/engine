import { SpecError } from './SpecError'
import type { Browser } from '@domain/services/Browser'
import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Action } from './Action'
import type { Result } from './Result'
import { Open } from './Action/Open'
import { BaseWithPage as ActionWithPage } from './Action/base'
import {
  BaseWithPage as ResultWithPage,
  BaseWithDatabase as ResultWithDatabase,
} from './Result/base'
import type { App } from '../app/App'

interface Params {
  name: string
  when: Action[]
  then: Result[]
  newBrowser: () => Browser
  logger: Logger
  feature: string
}

export class Spec implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }

  async test(app: App): Promise<SpecError | undefined> {
    const { when, then, newBrowser, logger, feature } = this.params
    let browser: Browser | undefined
    let page: BrowserPage | undefined
    try {
      const baseUrl = await app.start()
      if (
        when.find((action) => action instanceof ActionWithPage) ||
        then.find((result) => result instanceof ResultWithPage)
      ) {
        if (when.find((action) => action instanceof Open)) {
          browser = newBrowser()
          page = await browser.launch({ baseUrl })
        } else {
          throw new SpecError('OPEN_ACTION_REQUIRED', {
            feature,
            spec: this.name,
          })
        }
      }
      if (then.find((result) => result instanceof ResultWithDatabase)) {
        if (!app.database) throw new SpecError('DATABASE_REQUIRED', { feature, spec: this.name })
      }
      for (const action of when) {
        if (action instanceof ActionWithPage) {
          if (page) await action.executeWithPage(page)
        } else {
          await action.executeWithRequest(baseUrl)
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
      if (error instanceof SpecError) {
        logger.log('failed: ' + error.message)
        if (html) logger.log('html: ' + html)
        return error
      } else throw error
    }
  }
}
