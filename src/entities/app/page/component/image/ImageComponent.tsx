import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ImageComponentParams } from './ImageComponentParams'
import { PageConfig } from '../../Page'
import { ImageComponentUI } from './ImageComponentUI'
import { PageServices } from '../../PageServices'

export class ImageComponent extends BaseComponent {
  constructor(
    readonly params: ImageComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <ImageComponentUI
        url={this.params.url}
        text={this.params.text}
        width={this.params.width || 50}
        ui={this.services.ui}
        testId={this.params.testId}

      />
    )
  }
}
