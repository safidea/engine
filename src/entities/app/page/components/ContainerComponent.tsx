import React from 'react'
import { BaseComponent } from './BaseComponent'
import { ContainerUI } from '../../../spi/ui/ContainerUI'
import { Component } from '../Component'

export interface ContainerProps {
  UI: ContainerUI
  children: JSX.Element[]
}

export function Container({ UI, children }: ContainerProps) {
  return <UI.container>{children}</UI.container>
}

export class ContainerComponent extends BaseComponent {
  constructor(
    private readonly _ui: ContainerUI,
    public readonly components: Component[]
  ) {
    super('container')
  }

  renderUI(components: JSX.Element[]) {
    return () => <Container UI={this._ui}>{components}</Container>
  }
}
