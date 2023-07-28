import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'

export class Paragraph extends BaseComponent {
  constructor(
    private readonly _text: string = '',
    private readonly _ui: IUIGateway['ParagraphUI']
  ) {
    super('paragraph')
  }

  get text(): string {
    return this._text
  }

  renderUI() {
    const UI = this._ui
    const text = this._text
    return function Component() {
      return <UI>{text}</UI>
    }
  }
}
