import type { ComponentWithBlock as ComponentConfig } from '../../configs/page/component'
import { Hero } from '@domain/engine/page/component/marketing/Hero'
import { Footer } from '@domain/engine/page/component/marketing/Footer'
import type { Component, ReactComponents } from '@domain/engine/page/component'
import { Paragraph } from '@domain/engine/page/component/base/Paragraph'
import { Form } from '@domain/engine/page/component/application/Form'
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
import type { Block } from '@adapter/api/configs/Block'
import { Title } from '@domain/engine/page/component/base/Title'
import { ConfigError } from '@domain/entities/error/Config'

export interface Params {
  components: ReactComponents
  server: Server
  ui: Ui
  idGenerator: IdGenerator
  realtime?: Realtime
  blocks?: Block[]
}

export class ComponentMapper {
  static toEntity(config: ComponentConfig, params: Params): Component {
    const { components, server, ui, idGenerator, realtime, blocks = [] } = params
    if ('component' in config) {
      if (config.component === 'Hero') {
        return new Hero({ props: config, component: components.Hero })
      } else if (config.component === 'Header') {
        return new Header({ props: config, component: components.Header })
      } else if (config.component === 'Footer') {
        return new Footer({ props: config, component: components.Footer })
      } else if (config.component === 'Form') {
        return new Form({ props: config, component: components.Form, server, ui, idGenerator })
      } else if (config.component === 'Paragraph') {
        return new Paragraph({ props: config, component: components.Paragraph })
      } else if (config.component === 'Button') {
        return new Button({ props: config, component: components.Button })
      } else if (config.component === 'CTA') {
        return new Cta({ props: config, component: components.Cta })
      } else if (config.component === 'Features') {
        return new Features({ props: config, component: components.Features })
      } else if (config.component === 'Logos') {
        return new Logos({ props: config, component: components.Logos })
      } else if (config.component === 'NotFound') {
        return new NotFound({ props: config, component: components.NotFound })
      } else if (config.component === 'Link') {
        return new Link({ props: config, component: components.Link })
      } else if (config.component === 'Table') {
        return new Table({
          props: config,
          component: components.Table,
          server,
          ui,
          idGenerator,
          realtime,
        })
      } else if (config.component === 'Sidebar') {
        const children = (config.children ?? []).map((child) => this.toEntity(child, params))
        return new Sidebar({ props: { ...config, children }, component: components.Sidebar })
      } else if (config.component === 'Title') {
        return new Title({ props: config, component: components.Title })
      }
    } else if ('block' in config) {
      const { block: blockName, ...res } = config
      const block = blocks.find((c) => c.name === blockName)
      if (!block) {
        throw new ConfigError({ message: `Block not found: ${config.block}` })
      }
      return this.toEntity({ ...block, ...res }, params)
    }
    throw new Error('Invalid component')
  }

  static toManyEntities(configs: ComponentConfig[], params: Params): Component[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
