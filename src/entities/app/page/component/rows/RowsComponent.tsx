import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { RowsComponentParams } from './RowsComponentParams'
import { PageConfig } from '../../Page'
import { RowsComponentUI } from './RowsComponentUI'
import { PageServices } from '../../PageServices'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'

export class RowsComponent extends BaseComponent {
  readonly components: Component[]

  constructor(params: RowsComponentParams, services: PageServices, config: PageConfig) {
    const { type, components } = params
    super({ type }, services, config)
    this.components = components.map((component) => newComponent(component, services, config))
  }

  async render(context: Context) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => <RowsComponentUI ui={this.services.ui} Components={Components} />
  }
}
