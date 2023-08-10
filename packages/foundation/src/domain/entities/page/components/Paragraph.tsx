import React from 'react'
import { BaseComponent } from './BaseComponent'
import { ParagraphUI } from '../../../spi/ui/ParagraphUI'

export class Paragraph extends BaseComponent {
  constructor(
    private readonly _text: string = '',
    private readonly _ui: ParagraphUI
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
      return <UI.paragraph>{text}</UI.paragraph>
    }
  }
}
