import { LinkUIProps } from '@domain/repositories/IUIRepository'
import { BaseComponent } from './BaseComponent'
import { FC } from 'react'

export class Link extends BaseComponent {
  constructor(
    private readonly _path: string = '#',
    private readonly _label: string = '',
    private readonly _ui: FC<LinkUIProps>
  ) {
    super('link')
  }

  get path(): string {
    return this._path
  }

  get label(): string {
    return this._label
  }

  get render() {
    const UI = this._ui
    const path = this._path
    const label = this._label
    return function Component() {
      return <UI href={path}>{label}</UI>
    }
  }
}
