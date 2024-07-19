import { Columns } from '@domain/entities/Component/layout/Columns'
import { ComponentMapper, type Services } from '@adapter/api/mappers/ComponentMapper'
import type { Config } from '@adapter/api/configs/Component/layout/Columns'

export class ColumnsMapper {
  static toEntity = (config: Config, services: Services): Columns => {
    const { components } = services
    const children = ComponentMapper.toManyEntities(config.children, services)
    return new Columns({ ...config, children, Component: components.Columns })
  }
}
