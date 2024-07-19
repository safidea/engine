import { Grid } from '@domain/entities/Component/layout/Grid'
import { ComponentMapper, type Services } from '@adapter/api/mappers/ComponentMapper'
import type { Config } from '@adapter/api/configs/Component/layout/Grid'

export class GridMapper {
  static toEntity = (config: Config, services: Services): Grid => {
    const { components } = services
    const children = ComponentMapper.toManyEntities(config.children, services)
    return new Grid({ ...config, children, Component: components.Grid })
  }
}
