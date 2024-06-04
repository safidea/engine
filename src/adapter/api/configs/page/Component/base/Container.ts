import type { TextAlign } from '@domain/engine/page/component/base/Container'
import type { Component } from '..'
import type { Base } from './Base'

export interface Container extends Base {
  textAlign?: TextAlign
  children: Component[]
}

export interface ContainerComponent extends Container {
  component: 'Container'
}

export interface ContainerBlock extends ContainerComponent {
  ref: string
}

export interface ContainerBlockRef extends Partial<Container> {
  component: 'Container'
  blockRef: string
}
