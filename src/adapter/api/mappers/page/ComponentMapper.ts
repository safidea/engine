import type { Component as ComponentConfig } from '../../configs/page/component'
import { Hero } from '@domain/entities/page/component/marketing/Hero'
import { Footer } from '@domain/entities/page/component/marketing/Footer'
import type { Component, ReactComponents } from '@domain/entities/page/component'
import { Paragraph } from '@domain/entities/page/component/Paragraph'
import { Form } from '@domain/entities/page/component/application/Form'
import { Button } from '@domain/entities/page/component/Button'
import { Cta } from '@domain/entities/page/component/marketing/Cta'
import { Features } from '@domain/entities/page/component/marketing/Features'
import { Logos } from '@domain/entities/page/component/marketing/Logos'
import { NotFound } from '@domain/entities/page/component/marketing/NotFound'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'

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
    }
  }

  static toManyEntities(configs: ComponentConfig[], params: Params): Component[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
