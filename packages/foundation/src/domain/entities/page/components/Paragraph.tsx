import React from 'react'
import { UI } from '@adapter/spi/ui/UI'
import { BaseComponent } from './BaseComponent'

export class Paragraph extends BaseComponent {
  constructor(
    private readonly _text: string = '',
    private readonly _ui: UI['ParagraphUI']
  ) {
    super('paragraph')
  }

  get text(): string {
    return this._text
  }

  renderUI() {
    const UI = this._ui
    const text = this._text
    return function ParagraphUI() {
      return <UI>{text}</UI>
    }
  }
}
