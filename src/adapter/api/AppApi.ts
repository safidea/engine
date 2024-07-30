import { AppMapper } from './mappers/AppMapper'
import type { App } from '@domain/entities/App'
import type { App as Config } from './configs/App'
import type { SchemaError } from '@domain/entities/Error/Schema'
import type { Drivers } from '@adapter/spi/Drivers'
import type { ReactComponents } from '@domain/entities/Component'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import { SchemaValidatorMapper } from './mappers/ServiceMapper/SchemaValidatorMapper'
import { TestError } from '@domain/entities/Error/Test'
import { TestMapper } from './mappers/TestMapper'
import { BrowserMapper } from './mappers/ServiceMapper/BrowserMapper'

interface Ressources {
  drivers: Drivers
  components: ReactComponents
}

export class AppApi {
  private _log: (message: string) => void
  private _schemaValidator: SchemaValidator
  private _app?: App

  constructor(private ressources: Ressources) {
    this._schemaValidator = SchemaValidatorMapper.toService(ressources)
    this._log = (message: string) => {
      if (process.env.TESTING !== 'true' || process.env.DEBUG) {
        console.log(message)
      }
    }
  }

  test = async (config: unknown): Promise<void> => {
    const { drivers } = this.ressources
    const validatedConfig = this._getConfigWithEnv(config)
    delete validatedConfig.server?.port
    this._app = await this._validateConfigOrThrow(validatedConfig)
    const errors: TestError[] = []
    const tests = TestMapper.toManyEntities(validatedConfig.tests ?? [], this.ressources)
    const browser = BrowserMapper.toService({ drivers })
    this._log(`🔄 Start running tests`)
    await browser.launch()
    for (let i = 1; i <= tests.length; i++) {
      const test = tests[i - 1]
      try {
        const app = AppMapper.toEntity(this.ressources, validatedConfig)
        await app.init()
        const baseUrl = await app.start({ isTest: true })
        const page = await browser.newPage(baseUrl)
        await test.run(app, page)
        this._log(`✅ ${i} > ${test.name}`)
      } catch (error) {
        this._log(`❌ ${i} > ${test.name}`)
        if (error instanceof TestError) errors.push(error)
        else throw error
      }
    }
    await browser.close()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this._log(`✨ All tests passed`)
  }

  start = async (config: unknown): Promise<string> => {
    this._app = await this._validateOrThrow(config)
    const url = await this._app.start()
    this._log(`✨ App "${this._app.name}" started at ${url}`)
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

  private _getConfigWithEnv = (config: unknown): Config => {
    const configWithValidatedSchema = this._validateSchemaOrThrow(config)
    return this._replaceEnvVariablesDeep(configWithValidatedSchema)
  }

  private _validateConfigOrThrow = async (config: Config): Promise<App> => {
    const app = AppMapper.toEntity(this.ressources, config)
    const errors = await app.validateConfig()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this._log('✅ Config dependancies are valids')
    return app
  }

  private _validateOrThrow = async (config: unknown): Promise<App> => {
    const configWithEnv = this._getConfigWithEnv(config)
    return this._validateConfigOrThrow(configWithEnv)
  }

  private _isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private _isString = (value: unknown): value is string => {
    return typeof value === 'string'
  }

  private _replaceEnvVariablesDeep = <T>(obj: T): T => {
    const walk = (node: unknown) => {
      if (!this._isObject(node)) return
      Object.keys(node).forEach((key) => {
        const value = node[key]
        if (this._isString(value) && value.startsWith('$')) {
          const envVar = value.substring(1) // Remove the leading $
          const envValue = process.env[envVar]
          if (envValue !== undefined) {
            node[key] = envValue
          } else {
            console.warn(`Environment variable ${envVar} not found`)
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (this._isString(item) && item.startsWith('$')) {
              const envVar = item.substring(1) // Remove the leading $
              const envValue = process.env[envVar]
              if (envValue !== undefined) {
                value[index] = envValue
              } else {
                console.warn(`Environment variable ${envVar} not found`)
              }
            } else if (this._isObject(item)) {
              walk(item)
            }
          })
        } else if (this._isObject(value)) {
          walk(value)
        }
      })
    }

    walk(obj)
    return obj
  }
}
