import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { TitleComponentParams } from './TitleComponentParams'
import { PageConfig } from '../../Page'
import { TitleComponentUI } from './TitleComponentUI'
import { PageServices } from '../../PageServices'

export class TitleComponent extends BaseComponent {
  constructor(
    readonly params: TitleComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <TitleComponentUI
        ui={this.services.ui}
        text={this.params.text}
        size={this.params.size || 'medium'}
        testId={this.params.testId}
      />
    )
  }
}
