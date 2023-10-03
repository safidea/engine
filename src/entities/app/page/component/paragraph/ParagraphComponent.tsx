import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ParagraphComponentParams } from './ParagraphComponentParams'
import { PageConfig } from '../../Page'
import { ParagraphComponentUI } from './ParagraphComponentUI'
import { PageServices } from '../../PageServices'

export class ParagraphComponent extends BaseComponent {
  constructor(
    readonly params: ParagraphComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    return () => (
      <ParagraphComponentUI
        ui={this.services.ui}
        text={this.params.text}
        size={this.params.size || 'medium'}
        testId={this.params.testId}

      />
    )
  }
}
