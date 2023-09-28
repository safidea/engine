import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ImageComponentParams } from './ImageComponentParams'
import { PageConfig } from '../../Page'
import { ImageComponentUI } from './ImageComponentUI'
import { PageServices } from '../../PageServices'

export class ImageComponent extends BaseComponent {
  readonly url: string
  readonly text: string

  constructor(params: ImageComponentParams, services: PageServices, config: PageConfig) {
    const { type, url, text } = params
    super({ type }, services, config)
    this.url = url
    this.text = text
  }

  async render() {
    return () => <ImageComponentUI url={this.url} text={this.text} ui={this.services.ui} />
  }
}
