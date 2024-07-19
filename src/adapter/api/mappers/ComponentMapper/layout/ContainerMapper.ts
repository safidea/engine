import { Container } from '@domain/entities/Component/layout/Container'
import type { Config } from '@adapter/api/configs/Component/layout/Container'
import { ComponentMapper, type Services } from '@adapter/api/mappers/ComponentMapper'

export class ContainerMapper {
  static toEntity = (config: Config, services: Services): Container => {
    const { components } = services
    const children = ComponentMapper.toManyEntities(config.children, services)
    return new Container({ ...config, children, Component: components.Container })
  }
}
