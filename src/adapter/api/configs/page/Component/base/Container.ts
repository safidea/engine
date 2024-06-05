import type { Align } from '@domain/engine/page/component/base/base'
import type { Component } from '..'
import type { Base } from './Base'

export interface Container extends Base {
  align?: Align
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
