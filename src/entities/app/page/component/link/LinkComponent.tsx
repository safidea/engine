import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { LinkComponentParams } from './LinkComponentParams'
import { PageConfig } from '../../Page'
import { LinkComponentUI } from './LinkComponentUI'
import { PageServices } from '../../PageServices'

export class LinkComponent extends BaseComponent {
  constructor(
    readonly params: LinkComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <LinkComponentUI
        display={this.params.display}
        path={this.params.path}
        text={this.params.text}
        ui={this.services.ui}
        testId={this.params.testId}
        style={this.params.style}
      />
    )
  }
}
