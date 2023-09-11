import React from 'react'
import { BaseComponent } from './BaseComponent'
import { TitleUI } from '../../../spi/ui/TitleUI'

export type Size = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
export interface TitleProps {
  size: Size
  text: string
  UI: TitleUI
}

export function Title({ size, text, UI }: TitleProps) {
  switch (size) {
    case 'extra-small':
      return <UI.xs>{text}</UI.xs>
    case 'small':
      return <UI.sm>{text}</UI.sm>
    case 'medium':
      return <UI.md>{text}</UI.md>
    case 'large':
      return <UI.lg>{text}</UI.lg>
    case 'extra-large':
      return <UI.xl>{text}</UI.xl>
    default:
      return <UI.md>{text}</UI.md>
  }
}

export class TitleComponent extends BaseComponent {
  constructor(
    private readonly _text: string,
    private readonly _ui: TitleUI,
    private readonly _size: Size = 'medium'
  ) {
    super('title')
  }

  get text(): string {
    return this._text
  }

  get size(): Size {
    return this._size
  }

  renderUI() {
    return () => <Title UI={this._ui} text={this.text} size={this.size} />
  }
}
