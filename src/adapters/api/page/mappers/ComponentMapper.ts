import { Component } from '@entities/app/page/Component'
import { IUISpi } from '@entities/spi/IUISpi'
import { ListMapper } from './components/ListMapper'
import { NavigationMapper } from './components/NavigationMapper'
import { ParagraphMapper } from './components/ParagraphMapper'
import { TitleMapper } from './components/TitleMapper'
import { Link } from '@entities/app/page/components/Link'
import { Paragraph } from '@entities/app/page/components/Paragraph'
import { TitleComponent } from '@entities/app/page/components/TitleComponent'
import { Navigation } from '@entities/app/page/components/Navigation'
import { List } from '@entities/app/page/components/List'
import { Table } from '@entities/app/table/Table'
import { Form } from '@entities/app/page/components/Form'
import { FormMapper } from './components/FormMapper'
import { LinkMapper } from './components/LinkMapper'
import { ComponentDto } from '../dtos/ComponentDto'
import { ContainerComponentMapper } from './components/ContainerComponentMapper'
import { ContainerComponent } from '@entities/app/page/components/ContainerComponent'

export interface ComponentMapperSpis {
  ui?: IUISpi
}

export class ComponentMapper {
  static toEntity(
    componentDto: ComponentDto,
    tables: Table[],
    spis: ComponentMapperSpis
  ): Component {
    const { ui } = spis
    if (!ui) throw new Error('UISpi is required')
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
    if (type === 'container') {
      return ContainerComponentMapper.toEntity(componentDto, tables, spis)
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
    if (component instanceof TitleComponent) {
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
    if (component instanceof ContainerComponent) {
      return ContainerComponentMapper.toDto(component)
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
