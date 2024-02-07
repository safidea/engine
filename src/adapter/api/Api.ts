import { Spis } from '@adapter/spi'
import { Services } from '@domain/services'
import type { Mapper } from './mappers/Mapper'
import type { SchemaName } from '@domain/services/SchemaValidator'
import type { Engine } from '@domain/entities/Engine'
import type { EngineError } from '@domain/entities/EngineError'
import type { Params as SpisParams } from '@adapter/spi'

export class Api<Config, Error extends EngineError, Entity extends Engine, Params> {
  protected services: Services

  constructor(
    params: SpisParams,
    protected mapper: Mapper<Config, Error, Entity, Params>,
    private schema: SchemaName
  ) {
    this.services = new Services(new Spis(params))
  }

  getErrors(config: unknown): EngineError[] {
    const { errors, json } = this.services
      .schemaValidator({ error: this.mapper.toErrorEntityFromCode })
      .validate<Config>(config, this.schema)
    if (errors) return errors
    const table = this.mapper.toEntityFromServices(json, this.services)
    return table.validateConfig()
  }

  protected validate(config: unknown): config is Config {
    return this.getErrors(config).length === 0
  }
}
