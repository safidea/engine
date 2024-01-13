import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { RowComponentParams } from './RowComponentParams'
import { PageConfig } from '../../Page'
import { RowComponentUI } from './RowComponentUI'
import { PageServices } from '../../PageServices'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'

export class RowComponent extends BaseComponent {
  readonly components: Component[]

  constructor(
    readonly params: RowComponentParams,
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
      <RowComponentUI
        ui={this.services.ui}
        Components={Components}
        testId={this.params.testId}
        style={this.params.style}
      />
    )
  }
}
