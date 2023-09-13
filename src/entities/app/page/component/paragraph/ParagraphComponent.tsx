import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ParagraphComponentOptions, Size } from './ParagraphComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { ParagraphComponentUI } from './ParagraphComponentUI'

export class ParagraphComponent extends BaseComponent {
  readonly text: string
  readonly size?: Size

  constructor(options: ParagraphComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, text, size } = options
    super({ type }, drivers, config)
    this.text = text
    this.size = size
  }

  async render() {
    return () => <ParagraphComponentUI ui={this.drivers.ui} text={this.text} size={this.size} />
  }
}
