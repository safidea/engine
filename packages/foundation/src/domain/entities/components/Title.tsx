import { IUIRepository } from '@domain/repositories/IUIRepository'
import { BaseComponent } from './BaseComponent'

export class Title extends BaseComponent {
  constructor(
    private readonly _text: string = '#',
    private readonly _size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
    private readonly _ui: IUIRepository['TitleUI']
  ) {
    super('title')
  }

  get text(): string {
    return this._text
  }

  get size(): string {
    return this._size
  }

  renderUI() {
    const UI = this._ui
    const text = this.text
    const size = this.size
    return function Component() {
      switch (size) {
        case 'xs':
          return <UI.xs>{text}</UI.xs>
        case 'sm':
          return <UI.sm>{text}</UI.sm>
        case 'md':
          return <UI.md>{text}</UI.md>
        case 'lg':
          return <UI.lg>{text}</UI.lg>
        case 'xl':
          return <UI.xl>{text}</UI.xl>
        default:
          return <UI.md>{text}</UI.md>
      }
    }
  }
}
