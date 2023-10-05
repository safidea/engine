import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ParagraphComponentParams } from './ParagraphComponentParams'
import { PageConfig } from '../../Page'
import { ParagraphComponentUI } from './ParagraphComponentUI'
import { PageServices } from '../../PageServices'
import { IconComponent } from '../icon/IconComponent'

export class ParagraphComponent extends BaseComponent {
  constructor(
    readonly params: ParagraphComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    const props = {
      ui: this.services.ui,
      text: this.params.text,
      size: this.params.size || 'medium',
      testId: this.params.testId,
      Icon: undefined,
    }
    if (this.params.icon) {
      const icon = new IconComponent(
        { type: 'icon', name: this.params.icon.name },
        this.services,
        this.config
      )
      const Icon = await icon.render()
      return () => <ParagraphComponentUI {...props} Icon={Icon} />
    }
    return () => <ParagraphComponentUI {...props} />
  }
}
