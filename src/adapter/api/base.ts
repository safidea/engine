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

  validateSchema = (config: unknown): SchemaError[] => {
    const { errors = [] } = this.services.schemaValidator().validate<Config>(config, this.schema)
    return errors
  }

  validateConfig = (config: Config): ConfigError[] => {
    return this.mapper.toEntityFromServices(config, this.services).validateConfig()
  }

  protected validate = (config: unknown): config is Config => {
    const { errors, json } = this.services.schemaValidator().validate<Config>(config, this.schema)
    if (errors || !json) return false
    return this.validateConfig(json).length === 0
  }

  protected prepareConfig = (config: unknown): Config => {
    if (!this.validate(config)) throw new Error('Invalid config')
    return this.replaceEnvVariablesDeep(config)
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
