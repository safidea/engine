import {
  ComponentDto,
  LinkDto,
  ListDto,
  NavigationDto,
  ParagraphDto,
  TitleDto,
} from '@application/dtos/page/ComponentDto'
import { Component } from '@domain/entities/page/Component'
import { Link } from '@domain/entities/page/components/Link'
import { Paragraph } from '@domain/entities/page/components/Paragraph'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { Title } from '@domain/entities/page/components/Title'
import { List } from '@domain/entities/page/components/List'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToTitle(titleDto: TitleDto, ui: IUIGateway): Title {
  return new Title(titleDto.text, titleDto.size, ui.TitleUI)
}

export function mapDtoToParagraph(paragraphDto: ParagraphDto, ui: IUIGateway): Paragraph {
  return new Paragraph(paragraphDto.text, ui.ParagraphUI)
}

export function mapDtoToLink(linkDto: LinkDto, ui: IUIGateway): Link {
  return new Link(linkDto.path, linkDto.label, ui.LinkUI)
}

export function mapDtoToNavigation(navigationDto: NavigationDto, ui: IUIGateway): Navigation {
  const title = mapDtoToTitle(navigationDto.title, ui)
  const links = navigationDto.links.map((link) => mapDtoToLink(link, ui))
  const components = navigationDto.components.map((component) => mapDtoToComponent(component, ui))
  return new Navigation(title, links, components, ui.NavigationUI)
}

export function mapDtoToList(listDto: ListDto, ui: IUIGateway): List {
  return new List(listDto.table, listDto.groupBy, listDto.sortBy, listDto.columns, ui.ListUI)
}

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
