import { Spis, type Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Services } from '@domain/services'
import type { Mapper } from './mappers/Mapper'
import type { SchemaName } from '@domain/services/SchemaValidator'
import type { Engine } from '@domain/entities/Engine'
import type { EngineError } from '@domain/entities/EngineError'

export interface ApiParams {
  drivers?: Partial<Drivers>
  components?: Partial<ReactComponents>
}

export class Api<Dto, Error extends EngineError, Entity extends Engine> {
  constructor(
    private drivers: Drivers,
    private components: ReactComponents,
    private mapper: Mapper<Dto, Error, Entity>,
    private schema: SchemaName
  ) {}

  private services = (params?: ApiParams): Services => {
    const { drivers = {}, components = {} } = params ?? {}
    const mergedDrivers = { ...this.drivers, ...drivers }
    const mergedComponents = { ...this.components, ...components }
    return new Services(new Spis(mergedDrivers, mergedComponents))
  }

  getConfigErrors(config: unknown, params?: ApiParams): EngineError[] {
    const services = this.services(params)
    const { errors, json } = services
      .schemaValidator(this.mapper.toErrorEntityFromCode)
      .validate<Dto>(config, this.schema)
    if (errors) return errors
    const table = this.mapper.toEntity(json, services)
    return table.validateConfig()
  }

  isValidConfig(config: unknown, params?: ApiParams): config is Dto {
    return this.getConfigErrors(config, params).length === 0
  }

  createFromConfig(config: Dto, params?: ApiParams): Entity {
    const services = this.services(params)
    return this.mapper.toEntity(config, services)
  }
}
