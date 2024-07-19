import type { Component, ReactComponents } from '@domain/entities/Component'
import type { Client } from '@domain/services/Client'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'
import type { Realtime } from '@domain/services/Realtime'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { MarkdownParser } from '@domain/services/MarkdownParser'
import type { Component as Config } from '@adapter/api/configs/Component'
import type { IconLibrary } from '@domain/services/IconLibrary'
import { HeroMapper } from './marketing/HeroMapper'
import { HeaderMapper } from './marketing/HeaderMapper'
import { FooterMapper } from './marketing/FooterMapper'
import { FormMapper } from './application/FormMapper'
import { ParagraphMapper } from './content/ParagraphMapper'
import { ButtonMapper } from './base/ButtonMapper'
import { CtaMapper } from './marketing/CtaMapper'
import { FeaturesMapper } from './marketing/FeaturesMapper'
import { LogosMapper } from './marketing/LogosMapper'
import { NotFoundMapper } from './marketing/NotFoundMapper'
import { LinkMapper } from './content/LinkMapper'
import { TableMapper } from './application/TableMapper'
import { SidebarMapper } from './application/SidebarMapper'
import { TitleMapper } from './content/TitleMapper'
import { ImageMapper } from './content/ImageMapper'
import { InputMapper } from './base/InputMapper'
import { IconMapper } from './content/IconMapper'
import { ListMapper } from './application/ListMapper'
import { HeadingMapper } from './application/HeadingMapper'
import { ModalMapper } from './application/ModalMapper'
import { DropdownMapper } from './base/DropdownMapper'
import { ContainerMapper } from './layout/ContainerMapper'
import { ColumnsMapper } from './layout/ColumnsMapper'
import { CardMapper } from './base/CardMapper'
import { DividerMapper } from './content/DividerMapper'
import { SpacerMapper } from './content/SpacerMapper'
import { MarkdownMapper } from './content/MarkdownMapper'
import { GridMapper } from './layout/GridMapper'

export interface Services {
  components: ReactComponents
  server: Server
  ui: Ui
  client: Client
  idGenerator: IdGenerator
  realtime: Realtime
  templateCompiler: TemplateCompiler
  markdownParser: MarkdownParser
  iconLibrary: IconLibrary
}

export class ComponentMapper {
  static toEntity = (config: Config, services: Services): Component => {
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
    if (component === 'Table') return TableMapper.toEntity(config, services)
    if (component === 'Sidebar') return SidebarMapper.toEntity(config, services)
    if (component === 'Title') return TitleMapper.toEntity(config, services)
    if (component === 'Image') return ImageMapper.toEntity(config, services)
    if (component === 'Input') return InputMapper.toEntity(config, services)
    if (component === 'Icon') return IconMapper.toEntity(config, services)
    if (component === 'List') return ListMapper.toEntity(config, services)
    if (component === 'Heading') return HeadingMapper.toEntity(config, services)
    if (component === 'Modal') return ModalMapper.toEntity(config, services)
    if (component === 'Dropdown') return DropdownMapper.toEntity(config, services)
    if (component === 'Container') return ContainerMapper.toEntity(config, services)
    if (component === 'Columns') return ColumnsMapper.toEntity(config, services)
    if (component === 'Card') return CardMapper.toEntity(config, services)
    if (component === 'Divider') return DividerMapper.toEntity(config, services)
    if (component === 'Spacer') return SpacerMapper.toEntity(config, services)
    if (component === 'Markdown') return MarkdownMapper.toEntity(config, services)
    if (component === 'Grid') return GridMapper.toEntity(config, services)
    throw new Error(`ComponentMapper: component not found: ${component}`)
  }

  static toManyEntities = (configs: Config[], services: Services): Component[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
