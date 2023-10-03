import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ContainerComponentParams } from './ContainerComponentParams'
import { PageConfig } from '@entities/app/page/Page'
import { ContainerComponentUI } from './ContainerComponentUI'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'
import { PageServices } from '../../PageServices'

export class ContainerComponent extends BaseComponent {
  readonly components: Component[]

  constructor(
    readonly params: ContainerComponentParams,
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
      <ContainerComponentUI
        ui={this.services.ui}
        Components={Components}
        testId={this.params.testId}
      />
    )
  }
}
