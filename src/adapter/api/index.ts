import { AppMapper } from './mappers/AppMapper'
import type { StoppedApp } from '@domain/entities/App/Stopped'
import type { Config } from './configs'
import type { SchemaError } from '@domain/entities/Error/Schema'
import type { Drivers } from '@adapter/spi/drivers'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import { SchemaValidatorMapper } from './mappers/Services/SchemaValidatorMapper'
import { TestError } from '@domain/entities/Error/Test'
import { TestMapper } from './mappers/TestMapper'
import { BrowserMapper } from './mappers/Services/BrowserMapper'
import type { Integrations } from '@adapter/spi/integrations'
import type { StartedApp } from '@domain/entities/App/Started'

export default class {
  private _schemaValidator: SchemaValidator

  constructor(
    private _drivers: Drivers,
    private _integrations: Integrations
  ) {
    this._schemaValidator = SchemaValidatorMapper.toService(_drivers)
  }

  start = async (config: unknown): Promise<StartedApp> => {
    const stoppedApp = await this._validateOrThrow(config)
    const startedApp = await stoppedApp.start()
    return startedApp
  }

  test = async (config: unknown): Promise<void> => {
    const validatedConfig = this._validateSchemaOrThrow(config)
    delete validatedConfig.server?.port
    const { logger } = await this._validateConfigOrThrow(validatedConfig)
    const errors: TestError[] = []
    const tests = TestMapper.toManyEntities(this._drivers, validatedConfig.tests || [])
    const browser = BrowserMapper.toService(this._drivers)
    logger.info(`🔄 running ${tests.length} tests`)
    const page = await browser.launch()
    for (let i = 1; i <= tests.length; i++) {
      const test = tests[i - 1]
      try {
        const stoppedApp = AppMapper.toEntity(this._drivers, this._integrations, validatedConfig)
        await stoppedApp.init()
        const startedApp = await stoppedApp.start({ isTest: true })
        await page.new(startedApp.url)
        await test.run(startedApp, page)
        logger.info(`✅ ${i} > ${test.name}`)
      } catch (error) {
        logger.info(`❌ ${i} > ${test.name}`)
        if (error instanceof TestError) errors.push(error)
        else throw error
      }
    }
    await page.close()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    logger.info(`✨ all tests passed`)
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
    return { ...config }
  }

  private _validateConfigOrThrow = async (config: Config): Promise<StoppedApp> => {
    const stoppedApp = AppMapper.toEntity(this._drivers, this._integrations, config)
    await stoppedApp.logger.init()
    stoppedApp.logger.info('✅ config schema is valid')
    const errors = await stoppedApp.validateConfig()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    stoppedApp.logger.info('✅ config dependancies are valids')
    return stoppedApp
  }

  private _validateOrThrow = async (config: unknown): Promise<StoppedApp> => {
    const configWithValidSchema = this._validateSchemaOrThrow(config)
    return this._validateConfigOrThrow(configWithValidSchema)
  }
}
