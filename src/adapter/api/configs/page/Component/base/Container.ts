import type { Align, Size, SizeWithNone } from '@domain/engine/page/component/base/base'
import type { Component } from '..'
import type { Base } from './Base'

export interface Container extends Base {
  children: Component[]
  align?: Align
  width?: Size
  spacing?: SizeWithNone
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
