import { Columns } from '@domain/entities/Component/layout/Columns'
import {
  ComponentMapper,
  type ComponentServices,
  type ComponentEntities,
} from '@adapter/api/mappers/ComponentMapper'
import type { Config } from '@adapter/api/configs/Component/layout/Columns'

export class ColumnsMapper {
  static toEntity = (
    config: Config,
    services: ComponentServices,
    entities: ComponentEntities
  ): Columns => {
    const children = ComponentMapper.toManyEntities(config.children, services, entities)
    return new Columns(config, services, { children })
  }
}
