import React from 'react'
import { BaseComponent } from './BaseComponent'
import { ParagraphUI } from '../../../spi/ui/ParagraphUI'

type Size = 'sm' | 'md' | 'lg'
export interface ParagraphProps {
  text: string
  size: Size
  UI: ParagraphUI
}

export function ParagraphComponent({ text, size, UI }: ParagraphProps) {
  switch (size) {
    case 'sm':
      return <UI.small>{text}</UI.small>
    case 'md':
      return <UI.medium>{text}</UI.medium>
    case 'lg':
      return <UI.large>{text}</UI.large>
    default:
      return <UI.medium>{text}</UI.medium>
  }
}

export class Paragraph extends BaseComponent {
  constructor(
    private readonly _text: string = '',
    private readonly _ui: ParagraphUI,
    private readonly _size: Size = 'md'
  ) {
    super('paragraph')
  }

  get text(): string {
    return this._text
  }

  get size(): Size {
    return this._size
  }

  renderUI() {
    return () => <ParagraphComponent UI={this._ui} text={this._text} size={this._size} />
  }
}
