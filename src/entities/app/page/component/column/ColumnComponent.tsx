import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ColumnComponentParams } from './ColumnComponentParams'
import { PageConfig } from '../../Page'
import { ColumnComponentUI } from './ColumnComponentUI'
import { PageServices } from '../../PageServices'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'

export class ColumnComponent extends BaseComponent {
  readonly components: Component[]

  constructor(params: ColumnComponentParams, services: PageServices, config: PageConfig) {
    const { type, components } = params
    super({ type }, services, config)
    this.components = components.map((component) => newComponent(component, services, config))
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <ColumnComponentUI ui={this.services.ui} Components={Components} />
  }
}
