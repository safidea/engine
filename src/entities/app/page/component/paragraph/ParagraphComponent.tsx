import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ParagraphComponentParams, ParagraphSize } from './ParagraphComponentParams'
import { AppServices } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { ParagraphComponentUI } from './ParagraphComponentUI'

export class ParagraphComponent extends BaseComponent {
  readonly text: string
  readonly size?: ParagraphSize

  constructor(params: ParagraphComponentParams, services: AppServices, config: PageConfig) {
    const { type, text, size } = params
    super({ type }, services, config)
    this.text = text
    this.size = size
  }

  async render() {
    return () => <ParagraphComponentUI ui={this.services.ui} text={this.text} size={this.size} />
  }
}
