import { AppMapper } from './mappers/AppMapper'
import type { App } from '@domain/entities/App'
import type { App as Config } from './configs/App'
import type { SchemaError } from '@domain/entities/Error/Schema'
import type { Drivers } from '@adapter/spi/Drivers'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import { SchemaValidatorMapper } from './mappers/ServiceMapper/SchemaValidatorMapper'
import { TestError } from '@domain/entities/Error/Test'
import { TestMapper } from './mappers/TestMapper'
import { BrowserMapper } from './mappers/ServiceMapper/BrowserMapper'

export class AppApi {
  private _log: (message: string) => void
  private _schemaValidator: SchemaValidator
  private _app?: App

  constructor(private drivers: Drivers) {
    this._schemaValidator = SchemaValidatorMapper.toService(drivers)
    this._log = (message: string) => {
      if (process.env.TESTING !== 'true') {
        console.log(message)
      }
    }
  }

  test = async (config: unknown): Promise<void> => {
    const validatedConfig = this._validateSchemaOrThrow(config)
    delete validatedConfig.server?.port
    delete validatedConfig.monitor
    validatedConfig.logger = {
      driver: 'Console',
      silent: !validatedConfig.logger?.level || validatedConfig.logger.level === 'info',
    }
    this._app = await this._validateConfigOrThrow(validatedConfig)
    const errors: TestError[] = []
    const tests = TestMapper.toManyEntities(this.drivers, validatedConfig.tests ?? [])
    const browser = BrowserMapper.toService(this.drivers)
    this._log(`🔄 Start running tests`)
    const page = await browser.launch()
    for (let i = 1; i <= tests.length; i++) {
      const test = tests[i - 1]
      try {
        const app = AppMapper.toEntity(this.drivers, validatedConfig)
        await app.init()
        const baseUrl = await app.start({ isTest: true })
        await page.new(baseUrl)
        await test.run(app, page)
        this._log(`✅ ${i} > ${test.name}`)
      } catch (error) {
        this._log(`❌ ${i} > ${test.name}`)
        if (error instanceof TestError) errors.push(error)
        else throw error
      }
    }
    await page.close()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this._log(`✨ All tests passed`)
  }

  start = async (config: unknown): Promise<string> => {
    this._app = await this._validateOrThrow(config)
    const url = await this._app.start()
    return url
  }

  stop = async (): Promise<void> => {
    if (this._app) await this._app.stop()
  }

  private _getSchemaErrors = (config: unknown): SchemaError[] => {
    return this._schemaValidator.validateFromFile(config, 'app')
  }

  private _isConfig = (config: unknown): config is Config => {
    return this._getSchemaErrors(config).length === 0
  }

  private _validateSchemaOrThrow = (config: unknown): Config => {
    if (!this._isConfig(config)) {
      const errors = this._schemaValidator.validateFromFile(config, 'app')
      throw new Error(JSON.stringify(errors, null, 2))
    }
    this._log('✅ Config schema is valid')
    return { ...config }
  }

  private _validateConfigOrThrow = async (config: Config): Promise<App> => {
    const app = AppMapper.toEntity(this.drivers, config)
    const errors = await app.validateConfig()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this._log('✅ Config dependancies are valids')
    return app
  }

  private _validateOrThrow = async (config: unknown): Promise<App> => {
    const configWithValidSchema = this._validateSchemaOrThrow(config)
    return this._validateConfigOrThrow(configWithValidSchema)
  }
}
