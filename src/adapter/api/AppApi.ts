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

interface Ressources {
  drivers: Drivers
  components: ReactComponents
}

export class AppApi {
  private log: (message: string) => void
  private schemaValidator: SchemaValidator
  private app?: App

  constructor(private ressources: Ressources) {
    this.schemaValidator = SchemaValidatorMapper.toService(ressources)
    this.log = (message: string) => {
      if (process.env.TESTING !== 'true' || process.env.DEBUG) {
        console.log(message)
      }
    }
  }

  test = async (config: unknown): Promise<void> => {
    const validatedConfig = this.getConfigWithEnv(config)
    this.app = await this.validateConfigOrThrow(validatedConfig)
    const errors: TestError[] = []
    const tests = TestMapper.toManyEntities(validatedConfig.tests ?? [], this.ressources)
    this.log(`🔄 Start running tests`)
    for (let i = 1; i <= tests.length; i++) {
      const test = tests[i - 1]
      try {
        const app = AppMapper.toEntity(this.ressources, validatedConfig)
        await test.run(app)
        this.log(`✅ ${i} > ${test.name}`)
      } catch (error) {
        this.log(`❌ ${i} > ${test.name}`)
        if (error instanceof TestError) errors.push(error)
        else throw error
      }
    }
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this.log(`✨ All tests passed`)
  }

  start = async (config: unknown): Promise<string> => {
    this.app = await this.validateOrThrow(config)
    const url = await this.app.start()
    this.log(`✨ App "${this.app.name}" started at ${url}`)
    return url
  }

  stop = async (): Promise<void> => {
    if (this.app) await this.app.stop()
  }

  private getSchemaErrors = (config: unknown): SchemaError[] => {
    return this.schemaValidator.validate(config, 'app')
  }

  private isConfig = (config: unknown): config is Config => {
    return this.getSchemaErrors(config).length === 0
  }

  private validateSchemaOrThrow = (config: unknown): Config => {
    if (!this.isConfig(config)) {
      const errors = this.schemaValidator.validate(config, 'app')
      throw new Error(JSON.stringify(errors, null, 2))
    }
    this.log('✅ Config schema is valid')
    return config
  }

  private getConfigWithEnv = (config: unknown): Config => {
    const configWithValidatedSchema = this.validateSchemaOrThrow(config)
    return this.replaceEnvVariablesDeep(configWithValidatedSchema)
  }

  private validateConfigOrThrow = async (config: Config): Promise<App> => {
    const app = AppMapper.toEntity(this.ressources, config)
    const errors = await app.validateConfig()
    if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2))
    this.log('✅ Config dependancies are valids')
    return app
  }

  private validateOrThrow = async (config: unknown): Promise<App> => {
    const configWithEnv = this.getConfigWithEnv(config)
    return this.validateConfigOrThrow(configWithEnv)
  }

  private isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private isString = (value: unknown): value is string => {
    return typeof value === 'string'
  }

  private replaceEnvVariablesDeep = <T>(obj: T): T => {
    const walk = (node: unknown) => {
      if (!this.isObject(node)) return
      Object.keys(node).forEach((key) => {
        const value = node[key]
        if (this.isString(value) && value.startsWith('$')) {
          const envVar = value.substring(1) // Remove the leading $
          const envValue = process.env[envVar]
          if (envValue !== undefined) {
            node[key] = envValue
          } else {
            console.warn(`Environment variable ${envVar} not found`)
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (this.isString(item) && item.startsWith('$')) {
              const envVar = item.substring(1) // Remove the leading $
              const envValue = process.env[envVar]
              if (envValue !== undefined) {
                value[index] = envValue
              } else {
                console.warn(`Environment variable ${envVar} not found`)
              }
            } else if (this.isObject(item)) {
              walk(item)
            }
          })
        } else if (this.isObject(value)) {
          walk(value)
        }
      })
    }

    walk(obj)
    return obj
  }
}
