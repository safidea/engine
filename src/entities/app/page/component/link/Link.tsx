import React from 'react'
import { BaseComponent } from './BaseComponent'
import { LinkUI } from '../../../spi/ui/LinkUI'

export interface LinkProps {
  path: string
  label: string
  UI: LinkUI
}

export function LinkComponent({ path, label, UI }: LinkProps) {
  return <UI.link href={path}>{label}</UI.link>
}

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
    return () => <LinkComponent path={this._path} label={this._label} UI={this._ui} />
  }
}
