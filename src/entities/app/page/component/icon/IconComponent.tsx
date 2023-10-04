import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { IconComponentParams } from './IconComponentParams'
import { PageConfig } from '../../Page'
import { IconComponentUI } from './IconComponentUI'
import { PageServices } from '../../PageServices'

export class IconComponent extends BaseComponent {
  constructor(
    readonly params: IconComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <IconComponentUI
        name={this.params.name}
        size={this.params.size || 5}
        ui={this.services.ui}
        testId={this.params.testId}
      />
    )
  }
}
