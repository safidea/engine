import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ButtonComponentParams } from './ButtonComponentParams'
import { PageConfig } from '../../Page'
import { ButtonComponentUI } from './ButtonComponentUI'
import { PageServices } from '../../PageServices'

export class ButtonComponent extends BaseComponent {
  constructor(
    readonly params: ButtonComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <ButtonComponentUI
        text={this.params.text}
        ui={this.services.ui}
        testId={this.params.testId}
        style={this.params.style}
      />
    )
  }
}
