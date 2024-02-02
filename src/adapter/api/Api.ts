import { Spis, type Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Services } from '@domain/services'
import type { Mapper } from './mappers/Mapper'
import type { SchemaName } from '@domain/services/SchemaValidator'
import type { Engine } from '@domain/entities/Engine'
import type { EngineError } from '@domain/entities/EngineError'

export interface ApiOptions {
  drivers?: Partial<Drivers>
  components?: Partial<ReactComponents>
}

export class Api<Dto, Error extends EngineError, Entity extends Engine> {
  protected services: Services

  constructor(
    drivers: Drivers,
    components: ReactComponents,
    private mapper: Mapper<Dto, Error, Entity>,
    private schema: SchemaName
  ) {
    this.services = new Services(new Spis(drivers, components))
  }

  getConfigErrors(config: unknown): EngineError[] {
    const { errors, json } = this.services
      .schemaValidator(this.mapper.toErrorEntityFromCode)
      .validate<Dto>(config, this.schema)
    if (errors) return errors
    const table = this.mapper.toEntity(json, this.services)
    return table.validateConfig()
  }

  isValidConfig(config: unknown): config is Dto {
    return this.getConfigErrors(config).length === 0
  }

  createFromConfig(config: Dto): Entity {
    return this.mapper.toEntity(config, this.services)
  }
}
