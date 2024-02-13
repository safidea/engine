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
}
