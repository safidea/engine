import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ColumnsComponentParams } from './ColumnsComponentParams'
import { PageConfig } from '../../Page'
import { ColumnsComponentUI } from './ColumnsComponentUI'
import { PageServices } from '../../PageServices'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'

export class ColumnsComponent extends BaseComponent {
  readonly components: Component[]

  constructor(params: ColumnsComponentParams, services: PageServices, config: PageConfig) {
    const { type, components } = params
    super({ type }, services, config)
    this.components = components.map((component) => newComponent(component, services, config))
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <ColumnsComponentUI ui={this.services.ui} Components={Components} />
  }
}
