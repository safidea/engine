import React from 'react'
import { BaseComponent } from './BaseComponent'
import { LinkUI } from '../../../spi/ui/LinkUI'

export class Link extends BaseComponent {
  constructor(
    private readonly _path: string = '#',
    private readonly _label: string = '',
    private readonly _ui: LinkUI
  ) {
    super('link')
  }

  get path(): string {
    return this._path
  }

  get label(): string {
    return this._label
  }

  renderUI() {
    const UI = this._ui
    const path = this._path
    const label = this._label
    return function LinkUI() {
      return <UI.link href={path}>{label}</UI.link>
    }
  }
}
