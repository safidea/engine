import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ContainerComponentParams } from './ContainerComponentParams'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '@entities/app/page/Page'
import { ContainerComponentUI } from './ContainerComponentUI'
import { Component, newComponent } from '../Component'
import { PageContext } from '../../PageContext'

export class ContainerComponent extends BaseComponent {
  readonly components: Component[]

  constructor(params: ContainerComponentParams, drivers: AppDrivers, config: PageConfig) {
    const { type, components } = params
    super({ type }, drivers, config)
    this.components = components.map((component) => newComponent(component, drivers, config))
  }

  async render(context: PageContext) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <ContainerComponentUI ui={this.drivers.ui} Components={Components} />
  }
}
