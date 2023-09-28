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

  constructor(params: RowComponentParams, services: PageServices, config: PageConfig) {
    const { type, components } = params
    super({ type }, services, config)
    this.components = components.map((component) => newComponent(component, services, config))
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <RowComponentUI ui={this.services.ui} Components={Components} />
  }
}
