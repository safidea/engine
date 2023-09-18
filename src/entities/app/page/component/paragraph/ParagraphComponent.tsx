import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ParagraphComponentParams, ParagraphSize } from './ParagraphComponentParams'
import { PageConfig } from '../../Page'
import { ParagraphComponentUI } from './ParagraphComponentUI'
import { PageServices } from '../../PageServices'

export class ParagraphComponent extends BaseComponent {
  readonly text: string
  readonly size?: ParagraphSize

  constructor(params: ParagraphComponentParams, services: PageServices, config: PageConfig) {
    const { type, text, size } = params
    super({ type }, services, config)
    this.text = text
    this.size = size
  }

  async render() {
    return () => <ParagraphComponentUI ui={this.services.ui} text={this.text} size={this.size} />
  }
}
