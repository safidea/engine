import { Grid } from '@domain/entities/Component/layout/Grid'
import {
  ComponentMapper,
  type ComponentEntities,
  type ComponentServices,
} from '@adapter/api/mappers/ComponentMapper'
import type { Config } from '@adapter/api/configs/Component/layout/Grid'

export class GridMapper {
  static toEntity = (
    config: Config,
    services: ComponentServices,
    entities: ComponentEntities
  ): Grid => {
    const children = ComponentMapper.toManyEntities(config.children, services, entities)
    return new Grid(config, services, { children })
  }
}
