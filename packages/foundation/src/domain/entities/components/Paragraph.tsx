import { UIProps } from '@domain/repositories/IUIRepository'
import { BaseComponent } from './BaseComponent'
import { FC } from 'react'

export class Paragraph extends BaseComponent {
  constructor(
    private readonly _text: string = '',
    private readonly _ui: FC<UIProps>
  ) {
    super('paragraph')
  }

  get text(): string {
    return this._text
  }

  get render() {
    const UI = this._ui
    const text = this._text
    return function Component() {
      return <UI>{text}</UI>
    }
  }
}
