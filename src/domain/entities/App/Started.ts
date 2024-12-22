import {
  BaseApp,
  type AppConfig,
  type AppEntities,
  type AppIntegrations,
  type AppServices,
} from './Base'
import { StoppedApp } from './Stopped'

export class StartedApp extends BaseApp {
  constructor(
    config: AppConfig,
    services: AppServices,
    entities: AppEntities,
    integrations: AppIntegrations
  ) {
    super(config, services, entities, integrations)
  }

  get url() {
    const url = this._services.server.baseUrl
    if (!url) throw new Error('server url is not defined')
    return url
  }

  stop = async (options?: { graceful?: boolean }): Promise<StoppedApp> => {
    if (this.status !== 'running')
      throw new Error(`App is not running, current status is ${this.status}`)
    const { graceful = true } = options || {}
    this._setStatus('stopping')
    const { server, database, queue, mailer, logger } = this._services
    const { notion } = this.integrations
    await server.stop(async () => {
      await notion.stopPolling()
      await mailer.close()
      await queue.stop({ graceful })
      await database.disconnect()
    })
    this._setStatus('stopped')
    logger.info(`🛑 app "${this.name}" stopped`)
    return new StoppedApp(this._config, this._services, this._entities, this.integrations)
  }

  onClose = async (signal: 'SIGTERM' | 'SIGINT' | 'UNCAUGHT_EXCEPTION' | 'UNCAUGHT_REJECTION') => {
    this.logger.debug(`app received signal ${signal}`)
    await this.stop()
    process.exit(1)
  }
}
