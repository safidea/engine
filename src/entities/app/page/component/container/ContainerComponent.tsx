import React from 'react'
import { BaseComponent } from '../../base/BaseComponent'
import { ContainerComponentOptions } from './ContainerComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '@entities/app/page/Page'
import { ContainerComponentUI } from './ContainerComponentUI'

export class ContainerComponent extends BaseComponent {
  readonly components: JSX.Element[] = []

  constructor(options: ContainerComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, components } = options
    super({ type }, drivers, config)
    this.components = components
  }

  render(components: JSX.Element[]) {
    return () => <ContainerComponentUI ui={this.drivers.ui}>{components}</ContainerComponentUI>
  }
}
