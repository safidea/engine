import type { Component } from '@domain/entities/Component'
import type { IComponent } from '@adapter/api/configs/Component'
import { HeroMapper } from './marketing/HeroMapper'
import { HeaderMapper } from './marketing/HeaderMapper'
import { FooterMapper } from './marketing/FooterMapper'
import { FormMapper } from './application/FormMapper'
import { ParagraphMapper } from './content/ParagraphMapper'
import { ButtonMapper, type ButtonServices } from './base/ButtonMapper'
import { CtaMapper } from './marketing/CtaMapper'
import { FeaturesMapper } from './marketing/FeaturesMapper'
import { LogosMapper } from './marketing/LogosMapper'
import { NotFoundMapper } from './marketing/NotFoundMapper'
import { LinkMapper } from './content/LinkMapper'
import { TableMapper, type TableEntities, type TableServices } from './list/TableMapper'
import { SidebarMapper } from './application/SidebarMapper'
import { TitleMapper } from './content/TitleMapper'
import { ImageMapper } from './content/ImageMapper'
import { InputMapper } from './base/InputMapper'
import { IconMapper } from './content/IconMapper'
import { ListMapper } from './application/ListMapper'
import { HeadingMapper } from './application/HeadingMapper'
import { ModalMapper } from './application/ModalMapper'
import { DropdownMapper, type DropdownServices } from './base/DropdownMapper'
import { ContainerMapper } from './layout/ContainerMapper'
import { ColumnsMapper } from './layout/ColumnsMapper'
import { CardMapper } from './base/CardMapper'
import { DividerMapper } from './content/DividerMapper'
import { SpacerMapper } from './content/SpacerMapper'
import { MarkdownMapper, type MarkdownServices } from './content/MarkdownMapper'
import { GridMapper } from './layout/GridMapper'

export type ComponentServices = DropdownServices & ButtonServices & TableServices & MarkdownServices

export type ComponentEntities = TableEntities

export class ComponentMapper {
  static toEntity = (
    config: IComponent,
    services: ComponentServices,
    entities: ComponentEntities
  ): Component => {
    const { component } = config
    if (component === 'Hero') return HeroMapper.toEntity(config, services)
    if (component === 'Header') return HeaderMapper.toEntity(config, services)
    if (component === 'Footer') return FooterMapper.toEntity(config, services)
    if (component === 'Form') return FormMapper.toEntity(config, services)
    if (component === 'Paragraph') return ParagraphMapper.toEntity(config, services)
    if (component === 'Button') return ButtonMapper.toEntity(config, services)
    if (component === 'CTA') return CtaMapper.toEntity(config, services)
    if (component === 'Features') return FeaturesMapper.toEntity(config, services)
    if (component === 'Logos') return LogosMapper.toEntity(config, services)
    if (component === 'NotFound') return NotFoundMapper.toEntity(config, services)
    if (component === 'Link') return LinkMapper.toEntity(config, services)
    if (component === 'Table') return TableMapper.toEntity(config, services, entities)
    if (component === 'Sidebar') return SidebarMapper.toEntity(config, services, entities)
    if (component === 'Title') return TitleMapper.toEntity(config, services)
    if (component === 'Image') return ImageMapper.toEntity(config, services)
    if (component === 'Input') return InputMapper.toEntity(config, services)
    if (component === 'Icon') return IconMapper.toEntity(config, services)
    if (component === 'List') return ListMapper.toEntity(config, services)
    if (component === 'Heading') return HeadingMapper.toEntity(config, services)
    if (component === 'Modal') return ModalMapper.toEntity(config, services, entities)
    if (component === 'Dropdown') return DropdownMapper.toEntity(config, services)
    if (component === 'Container') return ContainerMapper.toEntity(config, services, entities)
    if (component === 'Columns') return ColumnsMapper.toEntity(config, services, entities)
    if (component === 'Card') return CardMapper.toEntity(config, services)
    if (component === 'Divider') return DividerMapper.toEntity(config, services)
    if (component === 'Spacer') return SpacerMapper.toEntity(config, services)
    if (component === 'Markdown') return MarkdownMapper.toEntity(config, services)
    if (component === 'Grid') return GridMapper.toEntity(config, services, entities)
    throw new Error(`ComponentMapper: component not found: ${component}`)
  }

  static toManyEntities = (
    configs: IComponent[],
    services: ComponentServices,
    entities: ComponentEntities
  ): Component[] => {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
