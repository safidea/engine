import { SpecError } from './SpecError'
import type { Database } from '@domain/services/Database'
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
import type { Server } from '@domain/services/Server'

interface Params {
  name: string
  when: Action[]
  then: Result[]
  newServer: () => Server
  newDatabase: () => Database
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

  async test(): Promise<SpecError | undefined> {
    const { when, then, newServer, newBrowser, newDatabase, logger, feature } = this.params
    const server = newServer()
    const baseUrl = await server.start()
    let database: Database | undefined
    let browser: Browser | undefined
    let page: BrowserPage | undefined
    const cleanRessources = async () => {
      await server.stop(async () => {
        if (browser) await browser.close()
        if (database) await database.disconnect()
      })
    }
    try {
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
        database = newDatabase()
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
          if (database) await result.executeWithDatabase(database)
        }
      }
      await cleanRessources()
      logger.log('passed')
    } catch (error) {
      await cleanRessources()
      logger.log('failed')
      if (error instanceof SpecError) return error
      else throw error
    }
  }
}
