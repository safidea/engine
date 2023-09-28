import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { LinkComponentParams } from './LinkComponentParams'
import { PageConfig } from '../../Page'
import { LinkComponentUI } from './LinkComponentUI'
import { PageServices } from '../../PageServices'

export class LinkComponent extends BaseComponent {
  readonly path: string
  readonly text: string

  constructor(params: LinkComponentParams, services: PageServices, config: PageConfig) {
    const { type, path, text } = params
    super({ type }, services, config)
    this.path = path
    this.text = text
  }

  async render() {
    return () => <LinkComponentUI path={this.path} text={this.text} ui={this.services.ui} />
  }
}
