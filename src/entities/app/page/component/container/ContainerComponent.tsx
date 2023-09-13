import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ContainerComponentOptions } from './ContainerComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '@entities/app/page/Page'
import { ContainerComponentUI } from './ContainerComponentUI'
import { Component, newComponent } from '../Component'
import { Context } from '../../Context'

export class ContainerComponent extends BaseComponent {
  readonly components: Component[]

  constructor(options: ContainerComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, components } = options
    super({ type }, drivers, config)
    this.components = components.map((component) => newComponent(component, drivers, config))
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <ContainerComponentUI ui={this.drivers.ui} Components={Components} />
  }
}
