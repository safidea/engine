import { ComponentDto } from '@application/dtos/page/ComponentDto'
import { Component } from '@domain/entities/page/Component'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapDtoToLink, mapLinkToDto } from './components/LinkMapper'
import { mapDtoToList, mapListToDto } from './components/ListMapper'
import { mapDtoToNavigation, mapNavigationToDto } from './components/NavigationMapper'
import { mapDtoToParagraph, mapParagraphToDto } from './components/ParagraphMapper'
import { mapDtoToTitle, mapTitleToDto } from './components/TitleMapper'
import { Link } from '@domain/entities/page/components/Link'
import { Paragraph } from '@domain/entities/page/components/Paragraph'
import { Title } from '@domain/entities/page/components/Title'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { List } from '@domain/entities/page/components/List'
import { Table } from '@domain/entities/table/Table'
import { Form } from '@domain/entities/page/components/Form'
import { mapDtoToForm, mapFormToDto } from './components/FormMapper'

export function mapDtoToComponent(
  componentDto: ComponentDto,
  ui: IUIGateway,
  tables: Table[]
): Component {
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
    return mapDtoToNavigation(componentDto, ui, tables)
  }
  if (type === 'list') {
    return mapDtoToList(componentDto, ui, tables)
  }
  if (type === 'form') {
    return mapDtoToForm(componentDto, ui) 
  }
  throw new Error(`Invalid component type ${type}`)
}

export function mapComponentToDto(component: Component): ComponentDto {
  if (component instanceof Link) {
    return mapLinkToDto(component)
  }
  if (component instanceof Paragraph) {
    return mapParagraphToDto(component)
  }
  if (component instanceof Title) {
    return mapTitleToDto(component)
  }
  if (component instanceof Navigation) {
    return mapNavigationToDto(component)
  }
  if (component instanceof List) {
    return mapListToDto(component)
  }
  if (component instanceof Form) {
    return mapFormToDto(component)
  }
  throw new Error(`Invalid component instance ${component}`)
}
