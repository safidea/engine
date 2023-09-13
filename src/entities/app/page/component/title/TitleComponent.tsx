import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { Size, TitleComponentOptions } from './TitleComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { TitleComponentUI } from './TitleComponentUI'

export class TitleComponent extends BaseComponent {
  readonly text: string
  readonly size?: Size

  constructor(options: TitleComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, text, size } = options
    super({ type }, drivers, config)
    this.text = text
    this.size = size
  }

  async render() {
    return () => <TitleComponentUI ui={this.drivers.ui} text={this.text} size={this.size} />
  }
}
