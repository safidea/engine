import type { Breakpoint, Padding } from '@domain/entities/Component/base'
import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
  center?: boolean
  breakpoint?: Breakpoint
  padding?: Padding
}

export interface Container extends Config {
  component: 'Container'
}
