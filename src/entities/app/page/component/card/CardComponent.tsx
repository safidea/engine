import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { CardComponentParams } from './CardComponentParams'
import { PageConfig } from '@entities/app/page/Page'
import { CardComponentUI } from './CardComponentUI'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'
import { PageServices } from '../../PageServices'

export class CardComponent extends BaseComponent {
  readonly components: Component[]

  constructor(
    readonly params: CardComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
    this.components = params.components.map((component) =>
      newComponent(component, services, config)
    )
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => (
      <CardComponentUI ui={this.services.ui} Components={Components} testId={this.params.testId} />
    )
  }
}
