import type { Component, ReactComponents } from '@domain/engine/page/component'
import type { Client } from '@domain/services/Client'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'
import type { Realtime } from '@domain/services/Realtime'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

import { Hero } from '@domain/engine/page/component/marketing/Hero'
import { Footer } from '@domain/engine/page/component/marketing/Footer'
import { Paragraph } from '@domain/engine/page/component/base/Paragraph'
import { Form } from '@domain/engine/page/component/application/Form'
import { List } from '@domain/engine/page/component/application/List'
import { Button } from '@domain/engine/page/component/base/Button'
import { Cta } from '@domain/engine/page/component/marketing/Cta'
import { Features } from '@domain/engine/page/component/marketing/Features'
import { Logos } from '@domain/engine/page/component/marketing/Logos'
import { NotFound } from '@domain/engine/page/component/marketing/NotFound'
import { Link } from '@domain/engine/page/component/base/Link'
import { Header } from '@domain/engine/page/component/marketing/Header'
import { Table } from '@domain/engine/page/component/application/Table'
import { Sidebar } from '@domain/engine/page/component/application/Sidebar'
import { Title } from '@domain/engine/page/component/base/Title'
import { Container } from '@domain/engine/page/component/base/Container'
import { Icon } from '@domain/engine/page/component/base/Icon'
import { Input } from '@domain/engine/page/component/base/Input'
import { Image } from '@domain/engine/page/component/base/Image'
import { Heading } from '@domain/engine/page/component/application/Heading'
import { Modal } from '@domain/engine/page/component/application/Modal'
import { Dropdown } from '@domain/engine/page/component/base/Dropdown'
import { Columns } from '@domain/engine/page/component/base/Columns'
import { Card } from '@domain/engine/page/component/base/Card'
import { Divider } from '@domain/engine/page/component/base/Divider'

import type { Component as ComponentConfig } from '../../configs/page/Component'
import type { Config as TitleConfig } from '@adapter/api/configs/page/Component/base/Title'
import type { Config as ContainerConfig } from '@adapter/api/configs/page/Component/base/Container'
import type { Config as ParagraphConfig } from '@adapter/api/configs/page/Component/base/Paragraph'
import type { Config as ButtonConfig } from '@adapter/api/configs/page/Component/base/Button'
import type { Config as LinkConfig } from '@adapter/api/configs/page/Component/base/Link'
import type { Config as IconConfig } from '@adapter/api/configs/page/Component/base/Icon'
import type { Config as InputConfig } from '@adapter/api/configs/page/Component/base/Input'
import type { Config as ImageConfig } from '@adapter/api/configs/page/Component/base/Image'
import type { Config as SidebarConfig } from '@adapter/api/configs/page/Component/application/Sidebar'
import type { Config as TableConfig } from '@adapter/api/configs/page/Component/application/Table'
import type { Config as NotFoundConfig } from '@adapter/api/configs/page/Component/marketing/NotFound'
import type { Config as LogosConfig } from '@adapter/api/configs/page/Component/marketing/Logos'
import type { Config as FeaturesConfig } from '@adapter/api/configs/page/Component/marketing/Features'
import type { Config as CtaConfig } from '@adapter/api/configs/page/Component/marketing/Cta'
import type { Config as FormConfig } from '@adapter/api/configs/page/Component/application/Form'
import type { Config as FooterConfig } from '@adapter/api/configs/page/Component/marketing/Footer'
import type { Config as HeaderConfig } from '@adapter/api/configs/page/Component/marketing/Header'
import type { Config as HeroConfig } from '@adapter/api/configs/page/Component/marketing/Hero'
import type { Config as ListConfig } from '@adapter/api/configs/page/Component/application/List'
import type { Config as HeadingConfig } from '@adapter/api/configs/page/Component/application/Heading'
import type { Config as ModalConfig } from '@adapter/api/configs/page/Component/application/Modal'
import type { Config as DropdownConfig } from '@adapter/api/configs/page/Component/base/Dropdown'
import type { Config as ColumnsConfig } from '@adapter/api/configs/page/Component/base/Columns'
import type { Config as CardConfig } from '@adapter/api/configs/page/Component/base/Card'
import type { Config as DividerConfig } from '@adapter/api/configs/page/Component/base/Divider'

export interface Params {
  components: ReactComponents
  server: Server
  ui: Ui
  client: Client
  idGenerator: IdGenerator
  realtime?: Realtime
  templateCompiler: TemplateCompiler
}

export class ComponentMapper {
  static toTitleEntity = (config: TitleConfig, params: Params): Title => {
    return new Title({ ...config, Component: params.components.Title })
  }

  static toContainerEntity = (config: ContainerConfig, params: Params): Container => {
    const children = (config.children ?? []).map((child) => this.toEntity(child, params))
    return new Container({ ...config, children, Component: params.components.Container })
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
    const links = config.links.map((link) =>
      'links' in link ? this.toDropdownEntity(link, params) : this.toLinkEntity(link, params)
    )
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

  static toModalEntity = (config: ModalConfig, params: Params): Modal => {
    const { components } = params
    const button = this.toButtonEntity(config.button, params)
    const header = config.header?.map((child) => this.toEntity(child, params))
    const body = config.body.map((child) => this.toEntity(child, params))
    const footer = config.footer?.map((child) => this.toEntity(child, params))
    return new Modal({ ...config, header, body, footer, button, Component: components.Modal })
  }

  static toDropdownEntity = (config: DropdownConfig, params: Params): Dropdown => {
    const { components } = params
    const links = this.toManyLinkEntities(config.links, params)
    return new Dropdown({ ...config, links, Component: components.Dropdown })
  }

  static toColumnsEntity = (config: ColumnsConfig, params: Params): Columns => {
    const { components } = params
    const children = config.children.map((child) => this.toEntity(child, params))
    return new Columns({ ...config, children, Component: components.Columns })
  }

  static toCardEntity = (config: CardConfig, params: Params): Card => {
    const { components } = params
    const image = config.image ? this.toImageEntity(config.image, params) : undefined
    const title = this.toTitleEntity(config.title, params)
    const paragraph = this.toParagraphEntity(config.paragraph, params)
    return new Card({ ...config, image, title, paragraph, Component: components.Card })
  }

  static toDividerEntity = (config: DividerConfig, params: Params): Divider => {
    return new Divider({ ...config, Component: params.components.Divider })
  }

  static toEntity = (config: ComponentConfig, params: Params): Component => {
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
    if (component === 'Modal') return this.toModalEntity(config, params)
    if (component === 'Dropdown') return this.toDropdownEntity(config, params)
    if (component === 'Container') return this.toContainerEntity(config, params)
    if (component === 'Columns') return this.toColumnsEntity(config, params)
    if (component === 'Card') return this.toCardEntity(config, params)
    if (component === 'Divider') return this.toDividerEntity(config, params)
    throw new Error(`Component ${component} is not supported`)
  }

  static toManyEntities = (configs: ComponentConfig[], params: Params): Component[] => {
    return configs.map((config) => this.toEntity(config, params))
  }
}
