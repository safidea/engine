import { NavigationDto } from '@adapter/api/page/dtos/components/NavigationDto'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { UI } from '@adapter/spi/ui/UI'
import { ComponentMapper } from '../ComponentMapper'
import { TitleMapper } from './TitleMapper'
import { LinkMapper } from './LinkMapper'
import { Table } from '@domain/entities/table/Table'

export class NavigationMapper {
  static toEntity(navigationDto: NavigationDto, ui: UI, tables: Table[]): Navigation {
    const title = TitleMapper.toEntity(navigationDto.title, ui)
    const links = LinkMapper.toEntities(navigationDto.links, ui)
    const components = ComponentMapper.toEntities(navigationDto.components, ui, tables)
    return new Navigation(title, links, components, ui.NavigationUI)
  }

  static toDto(navigation: Navigation): NavigationDto {
    return {
      type: 'navigation',
      title: TitleMapper.toDto(navigation.title),
      links: LinkMapper.toDtos(navigation.links),
      components: ComponentMapper.toDtos(navigation.components),
    }
  }

  static toEntities(navigationDtos: NavigationDto[], ui: UI, tables: Table[]): Navigation[] {
    return navigationDtos.map((navigationDto) => this.toEntity(navigationDto, ui, tables))
  }

  static toDtos(navigations: Navigation[]): NavigationDto[] {
    return navigations.map((navigation) => this.toDto(navigation))
  }
}
