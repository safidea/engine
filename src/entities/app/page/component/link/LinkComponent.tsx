import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { LinkComponentParams } from './LinkComponentParams'
import { PageConfig } from '../../Page'
import { LinkComponentUI } from './LinkComponentUI'
import { PageServices } from '../../PageServices'
import { IconComponent } from '../icon/IconComponent'

export class LinkComponent extends BaseComponent {
  constructor(
    readonly params: LinkComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    super(params, services, config)
  }

  async render() {
    const props = {
      size: this.params.size,
      display: this.params.display,
      path: this.params.path,
      text: this.params.text,
      ui: this.services.ui,
      testId: this.params.testId,
      style: this.params.style,
    }
    const icon = this.params.icon
    if (icon) {
      const { name, size, style, position } = icon
      const iconComponent = new IconComponent(
        {
          type: 'icon',
          name,
          size,
          style,
        },
        this.services,
        this.config
      )
      const Icon = await iconComponent.render()
      return () => <LinkComponentUI {...props} Icon={Icon} position={position} />
    }
    return () => <LinkComponentUI {...props} />
  }
}
