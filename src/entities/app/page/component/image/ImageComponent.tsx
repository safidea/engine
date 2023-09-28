import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { ImageComponentParams } from './ImageComponentParams'
import { PageConfig } from '../../Page'
import { ImageComponentUI } from './ImageComponentUI'
import { PageServices } from '../../PageServices'

export class ImageComponent extends BaseComponent {
  readonly url: string
  readonly text: string
  readonly width: number

  constructor(params: ImageComponentParams, services: PageServices, config: PageConfig) {
    const { type, url, text, width } = params
    super({ type }, services, config)
    this.url = url
    this.text = text
    this.width = width ?? 100
  }

  async render() {
    return () => (
      <ImageComponentUI url={this.url} text={this.text} width={this.width} ui={this.services.ui} />
    )
  }
}
