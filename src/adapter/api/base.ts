import { Spis } from '@adapter/spi'
import { Services } from '@domain/services'
import type { Mapper } from './mappers/Mapper'
import type { Base as BaseEngine } from '@domain/engine/base'
import type { Params as SpisParams } from '@adapter/spi'
import type { ConfigError } from '@domain/entities/error/Config'
import type { SchemaError } from '@domain/entities/error/Schema'

export class Base<Config, Engine extends BaseEngine, Params> {
  protected services: Services

  constructor(
    params: SpisParams,
    protected mapper: Mapper<Config, Engine, Params>,
    private schema: string
  ) {
    this.services = new Services(new Spis(params))
  }

  public getSchemaErrors = (config: unknown): SchemaError[] => {
    return this.services.schemaValidator().validate(config, this.schema)
  }

  private isConfig = (config: unknown): config is Config => {
    return this.getSchemaErrors(config).length === 0
  }

  protected validateSchemaOrThrow = (config: unknown): Config => {
    if (!this.isConfig(config)) {
      const errors = this.getSchemaErrors(config)
      throw new Error('Invalid schema: ' + errors[0].message)
    }
    return config
  }

  protected getConfigWithEnv = (config: unknown): Config => {
    const configWithValidatedSchema = this.validateSchemaOrThrow(config)
    return this.replaceEnvVariablesDeep(configWithValidatedSchema)
  }

  protected getEngine = (config: unknown): Engine => {
    const configWithEnv = this.getConfigWithEnv(config)
    return this.mapper.toEntityFromServices(configWithEnv, this.services)
  }

  public getConfigErrors = async (config: unknown): Promise<ConfigError[]> => {
    const engine = this.getEngine(config)
    return engine.validateConfig()
  }

  protected validateOrThrow = async (
    config: unknown
  ): Promise<{ config: Config; engine: Engine }> => {
    const configWithEnv = this.getConfigWithEnv(config)
    const engine = this.mapper.toEntityFromServices(configWithEnv, this.services)
    const errors = await engine.validateConfig()
    if (errors.length > 0) throw new Error('Invalid config: ' + errors[0].message)
    return { config: configWithEnv, engine }
  }

  protected validateConfigOrThrow = async (config: unknown): Promise<Config> => {
    const { config: validatedConfig } = await this.validateOrThrow(config)
    return validatedConfig
  }

  protected validateEngineOrThrow = async (config: unknown): Promise<Engine> => {
    const { engine } = await this.validateOrThrow(config)
    return engine
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
