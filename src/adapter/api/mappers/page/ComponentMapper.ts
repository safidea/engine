import type {
  Block,
  BlockRef as BlockRefConfig,
  Component as ComponentConfig,
  ComponentWithBlockRef as ComponentWithBlockRefConfig,
} from '../../configs/page/Component'
import { Hero } from '@domain/engine/page/component/marketing/Hero'
import { Footer } from '@domain/engine/page/component/marketing/Footer'
import type { Component, ReactComponents } from '@domain/engine/page/component'
import { Paragraph } from '@domain/engine/page/component/base/Paragraph'
import { Form } from '@domain/engine/page/component/application/Form'
import { List } from '@domain/engine/page/component/application/List'
import { Button } from '@domain/engine/page/component/base/Button'
import { Cta } from '@domain/engine/page/component/marketing/Cta'
import { Features } from '@domain/engine/page/component/marketing/Features'
import { Logos } from '@domain/engine/page/component/marketing/Logos'
import { NotFound } from '@domain/engine/page/component/marketing/NotFound'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'
import { Link } from '@domain/engine/page/component/base/Link'
import { Header } from '@domain/engine/page/component/marketing/Header'
import { Table } from '@domain/engine/page/component/application/Table'
import type { Realtime } from '@domain/services/Realtime'
import { Sidebar } from '@domain/engine/page/component/application/Sidebar'
import { Title } from '@domain/engine/page/component/base/Title'
import { InvalidBlock } from '@domain/engine/page/component/base/InvalidBlock'
import type { Client } from '@domain/services/Client'
import { Icon } from '@domain/engine/page/component/base/Icon'
import { Input } from '@domain/engine/page/component/base/Input'
import { Image } from '@domain/engine/page/component/base/Image'
import type { Title as TitleConfig } from '@adapter/api/configs/page/Component/base/Title'
import type { Paragraph as ParagraphConfig } from '@adapter/api/configs/page/Component/base/Paragraph'
import type { Button as ButtonConfig } from '@adapter/api/configs/page/Component/base/Button'
import type { Link as LinkConfig } from '@adapter/api/configs/page/Component/base/Link'
import type { Icon as IconConfig } from '@adapter/api/configs/page/Component/base/Icon'
import type { Input as InputConfig } from '@adapter/api/configs/page/Component/base/Input'
import type { Image as ImageConfig } from '@adapter/api/configs/page/Component/base/Image'
import type { Sidebar as SidebarConfig } from '@adapter/api/configs/page/Component/application/Sidebar'
import type { Table as TableConfig } from '@adapter/api/configs/page/Component/application/Table'
import type { NotFound as NotFoundConfig } from '@adapter/api/configs/page/Component/marketing/NotFound'
import type { Logos as LogosConfig } from '@adapter/api/configs/page/Component/marketing/Logos'
import type { Features as FeaturesConfig } from '@adapter/api/configs/page/Component/marketing/Features'
import type { Cta as CtaConfig } from '@adapter/api/configs/page/Component/marketing/Cta'
import type { Form as FormConfig } from '@adapter/api/configs/page/Component/application/Form'
import type { Footer as FooterConfig } from '@adapter/api/configs/page/Component/marketing/Footer'
import type { Header as HeaderConfig } from '@adapter/api/configs/page/Component/marketing/Header'
import type { Hero as HeroConfig } from '@adapter/api/configs/page/Component/marketing/Hero'
import type { List as ListConfig } from '@adapter/api/configs/page/Component/application/List'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { Heading } from '@domain/engine/page/component/application/Heading'
import type { Heading as HeadingConfig } from '@adapter/api/configs/page/Component/application/Heading'
import type { Customized as CustomizedConfig } from '@adapter/api/configs/page/Component/customized'
import { Customized, type CustomizedComponents } from '@domain/engine/page/component/Customized'
import { Modal } from '@domain/engine/page/component/application/Modal'
import type { Modal as ModalConfig } from '@adapter/api/configs/page/Component/application/Modal'
import { Menu } from '@domain/engine/page/component/base/Menu'
import type { Menu as MenuConfig } from '@adapter/api/configs/page/Component/base/Menu'

export interface Params {
  components: ReactComponents
  customized: CustomizedComponents
  server: Server
  ui: Ui
  client: Client
  idGenerator: IdGenerator
  realtime?: Realtime
  templateCompiler: TemplateCompiler
  blocks?: Block[]
}

export class ComponentMapper {
  static toTitleEntity = (config: TitleConfig, params: Params): Title => {
    return new Title({ ...config, Component: params.components.Title })
  }

  static toParagraphEntity = (config: ParagraphConfig, params: Params): Paragraph => {
    return new Paragraph({ ...config, Component: params.components.Paragraph })
  }

  static toButtonEntity = (config: ButtonConfig, params: Params): Button => {
    const { components, client, templateCompiler, server, ui, idGenerator } = params
    return new Button({
      ...config,
      Component: components.Button,
      client,
      templateCompiler,
      server,
      ui,
      idGenerator,
    })
  }

  static toManyButtonEntities = (configs: ButtonConfig[], params: Params): Button[] => {
    return configs.map((config) => this.toButtonEntity(config, params))
  }

  static toIconEntity = (config: IconConfig, params: Params): Icon => {
    return new Icon({ ...config, Component: params.components.Icon })
  }

  static toLinkEntity = (config: LinkConfig, params: Params): Link => {
    const prefixIcon = config.prefixIcon ? this.toIconEntity(config.prefixIcon, params) : undefined
    const suffixIcon = config.suffixIcon ? this.toIconEntity(config.suffixIcon, params) : undefined
    return new Link({ ...config, prefixIcon, suffixIcon, Component: params.components.Link })
  }

  static toManyLinkEntities = (configs: LinkConfig[], params: Params): Link[] => {
    return configs.map((config) => this.toLinkEntity(config, params))
  }

  static toInputEntity = (config: InputConfig, params: Params): Input => {
    return new Input({ ...config, Component: params.components.Input })
  }

  static toManyInputEntities = (configs: InputConfig[], params: Params): Input[] => {
    return configs.map((config) => this.toInputEntity(config, params))
  }

  static toImageEntity = (config: ImageConfig, params: Params): Image => {
    return new Image({ ...config, Component: params.components.Image })
  }

  static toManyImageEntities = (configs: ImageConfig[], params: Params): Image[] => {
    return configs.map((config) => this.toImageEntity(config, params))
  }

  static toSidebarEntity = (config: SidebarConfig, params: Params): Sidebar => {
    const title = this.toTitleEntity(config.title, params)
    const links = this.toManyLinkEntities(config.links, params)
    const children = (config.children ?? []).map((child) => this.toEntity(child, params))
    return new Sidebar({ ...config, title, links, children, Component: params.components.Sidebar })
  }

  static toTableEntity = (config: TableConfig, params: Params): Table => {
    const { server, ui, client, idGenerator, realtime, components } = params
    const title = config.title ? this.toTitleEntity(config.title, params) : undefined
    const buttons = config.buttons ? this.toManyButtonEntities(config.buttons, params) : undefined
    return new Table({
      ...config,
      title,
      buttons,
      Component: components.Table,
      server,
      ui,
      client,
      idGenerator,
      realtime,
    })
  }

  static toListEntity = (config: ListConfig, params: Params): List => {
    const { server, ui, client, idGenerator, realtime, components, templateCompiler } = params
    return new List({
      ...config,
      Component: components.List,
      server,
      ui,
      client,
      idGenerator,
      realtime,
      templateCompiler,
    })
  }

  static toNotFoundEntity = (config: NotFoundConfig, params: Params): NotFound => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    const button = this.toButtonEntity(config.button, params)
    return new NotFound({ ...config, title, paragraph, button, Component: components.NotFound })
  }

  static toLogosEntity = (config: LogosConfig, params: Params): Logos => {
    const { components } = params
    const title = config.title ? this.toTitleEntity(config.title, params) : undefined
    const paragraph = config.paragraph
      ? this.toParagraphEntity(config.paragraph, params)
      : undefined
    const images = this.toManyImageEntities(config.images, params)
    return new Logos({ ...config, title, paragraph, images, Component: components.Logos })
  }

  static toCtaEntity = (config: CtaConfig, params: Params): Cta => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    const buttons = this.toManyButtonEntities(config.buttons, params)
    return new Cta({ ...config, title, paragraph, buttons, Component: components.Cta })
  }

  static toFeaturesEntity = (config: FeaturesConfig, params: Params): Features => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    const features = config.features.map((feature) => {
      return {
        title: this.toTitleEntity(feature.title, params),
        paragraph: this.toParagraphEntity(feature.paragraph, params),
        icon: this.toIconEntity(feature.icon, params),
      }
    })
    return new Features({
      ...config,
      title,
      paragraph,
      features,
      Component: components.Features,
    })
  }

  static toFormEntity = (config: FormConfig, params: Params): Form => {
    const { components, server, ui, client, idGenerator, templateCompiler } = params
    const title = config.title ? this.toTitleEntity(config.title, params) : undefined
    const paragraph = config.paragraph
      ? this.toParagraphEntity(config.paragraph, params)
      : undefined
    const inputs = this.toManyInputEntities(config.inputs, params)
    const buttons = this.toManyButtonEntities(config.buttons, params)
    return new Form({
      ...config,
      title,
      paragraph,
      inputs,
      buttons,
      Component: components.Form,
      server,
      ui,
      idGenerator,
      client,
      templateCompiler,
    })
  }

  static toFooterEntity = (config: FooterConfig, params: Params): Footer => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    const links = this.toManyLinkEntities(config.links, params)
    return new Footer({ ...config, title, paragraph, links, Component: components.Footer })
  }

  static toHeaderEntity = (config: HeaderConfig, params: Params): Header => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const links = this.toManyLinkEntities(config.links, params)
    const buttons = this.toManyButtonEntities(config.buttons, params)
    return new Header({ ...config, title, links, buttons, Component: components.Header })
  }

  static toHeroEntity = (config: HeroConfig, params: Params): Hero => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    const buttons = this.toManyButtonEntities(config.buttons, params)
    return new Hero({ ...config, title, paragraph, buttons, Component: components.Hero })
  }

  static toHeadingEntity = (config: HeadingConfig, params: Params): Heading => {
    const { components } = params
    const title = this.toTitleEntity(config.title, params)
    const buttons = config.buttons ? this.toManyButtonEntities(config.buttons, params) : undefined
    return new Heading({ ...config, title, buttons, Component: components.Heading })
  }

  static toCustomizedEntity = (config: CustomizedConfig, params: Params): Customized => {
    const { customized } = params
    return new Customized({ ...config, customized })
  }

  static toModalEntity = (config: ModalConfig, params: Params): Modal => {
    const { components } = params
    const button = this.toButtonEntity(config.button, params)
    const header = config.header?.map((child) => this.toEntity(child, params))
    const body = config.body.map((child) => this.toEntity(child, params))
    const footer = config.footer?.map((child) => this.toEntity(child, params))
    return new Modal({ ...config, header, body, footer, button, Component: components.Modal })
  }

  static toMenuEntity = (config: MenuConfig, params: Params): Menu => {
    const { components } = params
    const links = this.toManyLinkEntities(config.links, params)
    return new Menu({ ...config, links, Component: components.Menu })
  }

  static toEntityFromComponent = (config: ComponentConfig, params: Params): Component => {
    const { component } = config
    if (component === 'Hero') return this.toHeroEntity(config, params)
    if (component === 'Header') return this.toHeaderEntity(config, params)
    if (component === 'Footer') return this.toFooterEntity(config, params)
    if (component === 'Form') return this.toFormEntity(config, params)
    if (component === 'Paragraph') return this.toParagraphEntity(config, params)
    if (component === 'Button') return this.toButtonEntity(config, params)
    if (component === 'CTA') return this.toCtaEntity(config, params)
    if (component === 'Features') return this.toFeaturesEntity(config, params)
    if (component === 'Logos') return this.toLogosEntity(config, params)
    if (component === 'NotFound') return this.toNotFoundEntity(config, params)
    if (component === 'Link') return this.toLinkEntity(config, params)
    if (component === 'Table') return this.toTableEntity(config, params)
    if (component === 'Sidebar') return this.toSidebarEntity(config, params)
    if (component === 'Title') return this.toTitleEntity(config, params)
    if (component === 'Image') return this.toImageEntity(config, params)
    if (component === 'Input') return this.toInputEntity(config, params)
    if (component === 'Icon') return this.toIconEntity(config, params)
    if (component === 'List') return this.toListEntity(config, params)
    if (component === 'Heading') return this.toHeadingEntity(config, params)
    if (component === 'Customized') return this.toCustomizedEntity(config, params)
    if (component === 'Modal') return this.toModalEntity(config, params)
    if (component === 'Menu') return this.toMenuEntity(config, params)
    throw new Error(`Component ${component} is not supported`)
  }

  static toEntityFromBlockRef = (config: BlockRefConfig, params: Params): Component => {
    const { blocks = [] } = params
    const block = blocks.find((c) => c.ref === config.blockRef)
    if (!block) {
      return new InvalidBlock({ message: `Block ${config.blockRef} does not exist` })
    }
    if (config.component === 'Title' && block.component === 'Title')
      return this.toTitleEntity({ ...block, ...config }, params)
    if (config.component === 'Paragraph' && block.component === 'Paragraph')
      return this.toParagraphEntity({ ...block, ...config }, params)
    if (config.component === 'Button' && block.component === 'Button')
      return this.toButtonEntity({ ...block, ...config }, params)
    if (config.component === 'Link' && block.component === 'Link')
      return this.toLinkEntity({ ...block, ...config }, params)
    if (config.component === 'Icon' && block.component === 'Icon')
      return this.toIconEntity({ ...block, ...config }, params)
    if (config.component === 'Input' && block.component === 'Input')
      return this.toInputEntity({ ...block, ...config }, params)
    if (config.component === 'Image' && block.component === 'Image')
      return this.toImageEntity({ ...block, ...config }, params)
    if (config.component === 'Sidebar' && block.component === 'Sidebar')
      return this.toSidebarEntity({ ...block, ...config }, params)
    if (config.component === 'Table' && block.component === 'Table')
      return this.toTableEntity({ ...block, ...config }, params)
    if (config.component === 'NotFound' && block.component === 'NotFound')
      return this.toNotFoundEntity({ ...block, ...config }, params)
    if (config.component === 'Logos' && block.component === 'Logos')
      return this.toLogosEntity({ ...block, ...config }, params)
    if (config.component === 'Features' && block.component === 'Features')
      return this.toFeaturesEntity({ ...block, ...config }, params)
    if (config.component === 'CTA' && block.component === 'CTA')
      return this.toCtaEntity({ ...block, ...config }, params)
    if (config.component === 'Form' && block.component === 'Form')
      return this.toFormEntity({ ...block, ...config }, params)
    if (config.component === 'Footer' && block.component === 'Footer')
      return this.toFooterEntity({ ...block, ...config }, params)
    if (config.component === 'Header' && block.component === 'Header')
      return this.toHeaderEntity({ ...block, ...config }, params)
    if (config.component === 'Hero' && block.component === 'Hero')
      return this.toHeroEntity({ ...block, ...config }, params)
    if (config.component === 'List' && block.component === 'List')
      return this.toListEntity({ ...block, ...config }, params)
    if (config.component === 'Heading' && block.component === 'Heading')
      return this.toHeadingEntity({ ...block, ...config }, params)
    if (config.component === 'Customized' && block.component === 'Customized')
      return this.toCustomizedEntity({ ...block, ...config }, params)
    if (config.component === 'Modal' && block.component === 'Modal')
      return this.toModalEntity({ ...block, ...config }, params)
    return new InvalidBlock({
      message: `BlockRef ${config.blockRef} is not a ${block.component} component`,
    })
  }

  static toEntity = (config: ComponentWithBlockRefConfig, params: Params): Component => {
    if ('blockRef' in config) {
      return this.toEntityFromBlockRef(config, params)
    } else {
      return this.toEntityFromComponent(config, params)
    }
  }

  static toManyEntities = (configs: ComponentWithBlockRefConfig[], params: Params): Component[] => {
    return configs.map((config) => this.toEntity(config, params))
  }
}
