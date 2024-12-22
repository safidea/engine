import type {
  CodeRunnerContextIntegrations,
  CodeRunnerContextServices,
} from '@domain/services/CodeRunner'
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
    integrations: AppIntegrations,
    private _isTest = false
  ) {
    super(config, services, entities, integrations)
    this._setStatus('started')
  }

  get url() {
    const url = this._services.server.baseUrl
    if (!url) throw new Error('server url is not defined')
    return url
  }

  get integrations(): CodeRunnerContextIntegrations {
    const { codeCompiler } = this._services
    return codeCompiler.getIntegrations()
  }

  get services(): CodeRunnerContextServices {
    const { codeCompiler } = this._services
    return codeCompiler.getServices()
  }

  get mailer() {
    if (!this._isTest) throw new Error('mailer is only available in test mode')
    return this._services.mailer
  }

  get queue() {
    if (!this._isTest) throw new Error('queue is only available in test mode')
    return this._services.queue
  }

  stop = async (options?: { graceful?: boolean }): Promise<StoppedApp> => {
    if (this._status !== 'started')
      throw new Error(`App is not running, current status is ${this._status}`)
    const { graceful = true } = options || {}
    this._setStatus('stopping')
    const { server, database, queue, mailer } = this._services
    const { notion } = this._integrations
    await server.stop(async () => {
      await notion.stopPolling()
      await mailer.close()
      await queue.stop({ graceful })
      await database.disconnect()
    })
    this._setStatus('stopped')
    this.logger.info(`🛑 app "${this.name}" stopped`)
    return new StoppedApp(this._config, this._services, this._entities, this._integrations)
  }

  onClose = async (signal: 'SIGTERM' | 'SIGINT' | 'UNCAUGHT_EXCEPTION' | 'UNCAUGHT_REJECTION') => {
    this.logger.debug(`app received signal ${signal}`)
    await this.stop()
    process.exit(1)
  }
}
