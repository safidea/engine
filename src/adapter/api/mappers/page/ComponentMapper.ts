import type { Component as ComponentConfig } from '../../configs/page/component'
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

export interface Params {
  components: ReactComponents
  server: Server
  ui: Ui
  idGenerator: IdGenerator
}

export class ComponentMapper {
  static toEntity(config: ComponentConfig, params: Params): Component {
    const { components, server, ui, idGenerator } = params
    switch (config.component) {
      case 'Hero':
        return new Hero({ props: config, component: components.Hero })
      case 'Header':
        return new Header({ props: config, component: components.Header })
      case 'Footer':
        return new Footer({ props: config, component: components.Footer })
      case 'Form':
        return new Form({ props: config, component: components.Form, server, ui, idGenerator })
      case 'Paragraph':
        return new Paragraph({ props: config, component: components.Paragraph })
      case 'Button':
        return new Button({ props: config, component: components.Button })
      case 'CTA':
        return new Cta({ props: config, component: components.Cta })
      case 'Features':
        return new Features({ props: config, component: components.Features })
      case 'Logos':
        return new Logos({ props: config, component: components.Logos })
      case 'NotFound':
        return new NotFound({ props: config, component: components.NotFound })
      case 'Link':
        return new Link({ props: config, component: components.Link })
      case 'Table':
        return new Table({ props: config, component: components.Table, server, ui, idGenerator })
    }
  }

  static toManyEntities(configs: ComponentConfig[], params: Params): Component[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
