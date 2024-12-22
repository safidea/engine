import type { Page } from '../Page'
import type { ConfigError } from '@domain/entities/Error/Config'
import { GetRequest } from '@domain/entities/Request/Get'
import { PageState } from '../Page/State'
import {
  BaseApp,
  type AppConfig,
  type AppEntities,
  type AppIntegrations,
  type AppServices,
} from './Base'
import { StartedApp } from './Started'

export class StoppedApp extends BaseApp {
  constructor(
    config: AppConfig,
    services: AppServices,
    entities: AppEntities,
    integrations: AppIntegrations
  ) {
    super(config, services, entities, integrations)
  }

  init = async (): Promise<void> => {
    const { theme, server } = this._services
    const { tables, pages, automations, buckets } = this._entities
    const { notion } = this.integrations
    await server.init(async () => {
      if (theme) {
        const getHtmlContent = (page: Page) =>
          page.htmlWithSampleProps(
            new PageState(new GetRequest({ path: page.path, baseUrl: server.baseUrl }))
          )
        const htmlContents = await Promise.all(pages.map(getHtmlContent))
        await theme.init(htmlContents)
      }
      await notion.init()
      for (const table of tables) await table.init()
      for (const automation of automations) await automation.init()
      for (const page of pages) await page.init()
      for (const bucket of buckets) await bucket.init()
    })
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    await this.init()
    const { tables, pages, automations, buckets } = this._entities
    const errors: Promise<ConfigError[]>[] = []
    errors.push(...tables.map((table) => table.validateConfig()))
    errors.push(...buckets.map((bucket) => bucket.validateConfig()))
    errors.push(...pages.map((page) => page.validateConfig()))
    errors.push(...automations.map((automation) => automation.validateConfig()))
    return Promise.all(errors).then((errors) => errors.flat())
  }

  start = async ({ isTest = false } = {}): Promise<StartedApp> => {
    if (this.status !== 'stopped')
      throw new Error(`App is not stopped, current status is ${this.status}`)
    this._setStatus('starting')
    const { server, database, queue, storage, mailer, realtime, logger, monitor } = this._services
    const { tables } = this._entities
    const { notion } = this.integrations
    await database.connect()
    await database.migrate(tables)
    await queue.start()
    await storage.connect()
    await storage.migrate()
    await mailer.verify()
    await realtime.setup()
    await notion.startPolling()
    await server.start()
    const startedApp = new StartedApp(
      this._config,
      this._services,
      this._entities,
      this.integrations
    )
    if (!isTest && server.env === 'production') {
      database.onError(async () => {
        if (this.status === 'running') {
          await startedApp.stop({ graceful: false })
        }
      })
      process.on('SIGTERM', () => startedApp.onClose('SIGTERM'))
      process.on('SIGINT', () => startedApp.onClose('SIGINT'))
      process.on('uncaughtException', (error: Error) => {
        logger.error(`uncaught exception: ${error.message}`)
        monitor.captureException(error)
        startedApp.onClose('UNCAUGHT_EXCEPTION')
      })
      process.on('unhandledRejection', (reason: Error, promise) => {
        logger.error(`uncaught rejection at: ${promise} 
          reason: ${reason}`)
        monitor.captureException(reason)
        startedApp.onClose('UNCAUGHT_REJECTION')
      })
    }
    this._setStatus('running')
    logger.info(`🚀 app "${this.name}" running at ${startedApp.url}`)
    return startedApp
  }
}
