import { ComponentDto } from '@application/dtos/page/ComponentDto'
import { Component } from '@domain/entities/page/Component'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapDtoToLink } from './components/LinkMapper'
import { mapDtoToList } from './components/ListMapper'
import { mapDtoToNavigation } from './components/NavigationMapper'
import { mapDtoToParagraph } from './components/ParagraphMapper'
import { mapDtoToTitle } from './components/TitleMapper'

export function mapDtoToComponent(componentDto: ComponentDto, ui: IUIGateway): Component {
  const { type } = componentDto
  if (type === 'link') {
    return mapDtoToLink(componentDto, ui)
  }
  if (type === 'paragraph') {
    return mapDtoToParagraph(componentDto, ui)
  }
  if (type === 'title') {
    return mapDtoToTitle(componentDto, ui)
  }
  if (type === 'navigation') {
    return mapDtoToNavigation(componentDto, ui)
  }
  if (type === 'list') {
    return mapDtoToList(componentDto, ui)
  }
  throw new Error(`Invalid component type ${type}`)
}
