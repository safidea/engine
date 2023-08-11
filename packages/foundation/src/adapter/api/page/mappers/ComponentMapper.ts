import { Component } from '@domain/entities/page/Component'
import { IUISpi } from '@domain/spi/IUISpi'
import { ListMapper } from './components/ListMapper'
import { NavigationMapper } from './components/NavigationMapper'
import { ParagraphMapper } from './components/ParagraphMapper'
import { TitleMapper } from './components/TitleMapper'
import { Link } from '@domain/entities/page/components/Link'
import { Paragraph } from '@domain/entities/page/components/Paragraph'
import { Title } from '@domain/entities/page/components/Title'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { List } from '@domain/entities/page/components/List'
import { Table } from '@domain/entities/table/Table'
import { Form } from '@domain/entities/page/components/Form'
import { FormMapper } from './components/FormMapper'
import { LinkMapper } from './components/LinkMapper'
import { ComponentDto } from '../dtos/ComponentDto'

export interface ComponentMapperSpis {
  ui: IUISpi
}

export class ComponentMapper {
  static toEntity(
    componentDto: ComponentDto,
    tables: Table[],
    spis: ComponentMapperSpis
  ): Component {
    const { ui } = spis
    const { type } = componentDto
    if (type === 'link') {
      return LinkMapper.toEntity(componentDto, ui)
    }
    if (type === 'paragraph') {
      return ParagraphMapper.toEntity(componentDto, ui)
    }
    if (type === 'title') {
      return TitleMapper.toEntity(componentDto, ui)
    }
    if (type === 'navigation') {
      return NavigationMapper.toEntity(componentDto, ui, tables)
    }
    if (type === 'list') {
      return ListMapper.toEntity(componentDto, ui, tables)
    }
    if (type === 'form') {
      return FormMapper.toEntity(componentDto, ui, tables)
    }
    throw new Error(`Invalid component type ${type}`)
  }

  static toDto(component: Component): ComponentDto {
    if (component instanceof Link) {
      return LinkMapper.toDto(component)
    }
    if (component instanceof Paragraph) {
      return ParagraphMapper.toDto(component)
    }
    if (component instanceof Title) {
      return TitleMapper.toDto(component)
    }
    if (component instanceof Navigation) {
      return NavigationMapper.toDto(component)
    }
    if (component instanceof List) {
      return ListMapper.toDto(component)
    }
    if (component instanceof Form) {
      return FormMapper.toDto(component)
    }
    throw new Error(`Invalid component instance ${component}`)
  }

  static toEntities(
    componentDtos: ComponentDto[],
    tables: Table[],
    spis: ComponentMapperSpis
  ): Component[] {
    return componentDtos.map((componentDto) => this.toEntity(componentDto, tables, spis))
  }

  static toDtos(components: Component[]): ComponentDto[] {
    return components.map((component) => this.toDto(component))
  }
}
