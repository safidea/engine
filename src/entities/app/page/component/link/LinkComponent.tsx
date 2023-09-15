import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { LinkComponentParams } from './LinkComponentParams'
import { AppServices } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { LinkComponentUI } from './LinkComponentUI'

export class LinkComponent extends BaseComponent {
  readonly path: string
  readonly label: string

  constructor(params: LinkComponentParams, services: AppServices, config: PageConfig) {
    const { type, path, label } = params
    super({ type }, services, config)
    this.path = path
    this.label = label
  }

  async render() {
    return () => <LinkComponentUI path={this.path} label={this.label} ui={this.services.ui} />
  }
}
