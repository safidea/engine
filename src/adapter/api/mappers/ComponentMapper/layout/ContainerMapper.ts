import { Container } from '@domain/entities/Component/layout/Container'
import type { Config } from '@adapter/api/configs/Component/layout/Container'
import {
  ComponentMapper,
  type ComponentEntities,
  type ComponentServices,
} from '@adapter/api/mappers/ComponentMapper'

export class ContainerMapper {
  static toEntity = (
    config: Config,
    services: ComponentServices,
    entities: ComponentEntities
  ): Container => {
    const children = ComponentMapper.toManyEntities(config.children, services, entities)
    return new Container(config, services, { children })
  }
}
