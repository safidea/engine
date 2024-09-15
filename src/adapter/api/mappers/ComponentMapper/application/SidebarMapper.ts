import { Sidebar } from '@domain/entities/Component/application/Sidebar'
import type { Config } from '@adapter/api/configs/Component/application/Sidebar'
import {
  ComponentMapper,
  type ComponentEntities,
  type ComponentServices,
} from '@adapter/api/mappers/ComponentMapper'
import { TitleMapper } from '../content/TitleMapper'
import { LinkMapper } from '../content/LinkMapper'

export class SidebarMapper {
  static toEntity = (
    config: Config,
    services: ComponentServices,
    entities: ComponentEntities
  ): Sidebar => {
    const title = TitleMapper.toEntity(config.title, services)
    const links = LinkMapper.toManyEntities(config.links, services)
    const children = ComponentMapper.toManyEntities(config.children ?? [], services, entities)
    return new Sidebar(config, services, { title, links, children })
  }
}
