import { NavigationDto } from '@application/dtos/page/components/NavigationDto'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapComponentToDto, mapDtoToComponent } from '../ComponentMapper'
import { mapDtoToTitle, mapTitleToDto } from './TitleMapper'
import { mapDtoToLink, mapLinkToDto } from './LinkMapper'
import { Table } from '@domain/entities/table/Table'

export function mapDtoToNavigation(
  navigationDto: NavigationDto,
  ui: IUIGateway,
  tables: Table[]
): Navigation {
  const title = mapDtoToTitle(navigationDto.title, ui)
  const links = navigationDto.links.map((link) => mapDtoToLink(link, ui))
  const components = navigationDto.components.map((component) =>
    mapDtoToComponent(component, ui, tables)
  )
  return new Navigation(title, links, components, ui.NavigationUI)
}

export function mapNavigationToDto(navigation: Navigation): NavigationDto {
  return {
    type: 'navigation',
    title: mapTitleToDto(navigation.title),
    links: navigation.links.map((link) => mapLinkToDto(link)),
    components: navigation.components.map((component) => mapComponentToDto(component)),
  }
}
