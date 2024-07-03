import type { Align, Size, SizeWithNone } from '@domain/engine/page/component/base/base'
import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
  align?: Align
  width?: Size
  spacing?: SizeWithNone
}

export interface Container extends Config {
  component: 'Container'
}
