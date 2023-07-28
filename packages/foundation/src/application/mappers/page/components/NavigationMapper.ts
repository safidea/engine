import { NavigationDto } from '@application/dtos/page/components/NavigationDto'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapDtoToComponent } from '../ComponentMapper'
import { mapDtoToTitle } from './TitleMapper'
import { mapDtoToLink } from './LinkMapper'

export function mapDtoToNavigation(navigationDto: NavigationDto, ui: IUIGateway): Navigation {
  const title = mapDtoToTitle(navigationDto.title, ui)
  const links = navigationDto.links.map((link) => mapDtoToLink(link, ui))
  const components = navigationDto.components.map((component) => mapDtoToComponent(component, ui))
  return new Navigation(title, links, components, ui.NavigationUI)
}
