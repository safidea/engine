import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { TitleSize, TitleComponentParams } from './TitleComponentParams'
import { PageConfig } from '../../Page'
import { TitleComponentUI } from './TitleComponentUI'
import { PageServices } from '../../PageServices'

export class TitleComponent extends BaseComponent {
  readonly text: string
  readonly size?: TitleSize

  constructor(params: TitleComponentParams, services: PageServices, config: PageConfig) {
    const { type, text, size } = params
    super({ type }, services, config)
    this.text = text
    this.size = size
  }

  async render() {
    return () => <TitleComponentUI ui={this.services.ui} text={this.text} size={this.size} />
  }
}
